import {
  apiListMedia,
  apiRegisterMedia,
  isSupabaseBackend,
  storageDownload,
  storagePublicUrl,
  storageUpload,
  type DbMediaRow,
} from './vendorApi'

const DB_NAME = 'wedyora-vendor-media'
const DB_VERSION = 1
const STORE = 'files'

export type StoredMediaFile = {
  key: string
  vendorId: string
  group: 'doc' | 'portfolioPhoto' | 'portfolioVideo' | 'clientWork' | 'studioWork' | 'profile' | 'bankCheque'
  id: string
  label: string
  fileName: string
  mime: string
  blob: Blob
  url?: string
}

function kycBucket(group: StoredMediaFile['group']) {
  return group === 'doc' || group === 'profile' || group === 'bankCheque' ? 'vendor-kyc' : 'vendor-portfolios'
}

function storagePath(vendorId: string, group: StoredMediaFile['group'], id: string, fileName: string) {
  const safe = fileName.replace(/[^\w.\-]+/g, '_')
  if (group === 'doc') return `${vendorId}/docs/${id}-${safe}`
  if (group === 'profile') return `${vendorId}/profile/${safe}`
  if (group === 'bankCheque') return `${vendorId}/bank/${safe}`
  if (group === 'portfolioPhoto') return `${vendorId}/photos/${id}-${safe}`
  if (group === 'portfolioVideo') return `${vendorId}/videos/${id}-${safe}`
  if (group === 'clientWork') return `${vendorId}/client/${id}-${safe}`
  return `${vendorId}/studio/${id}-${safe}`
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'key' })
        store.createIndex('vendorId', 'vendorId', { unique: false })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function localSaveVendorMedia(
  vendorId: string,
  payload: {
    docs: { id: string; label: string; file: File }[]
    portfolioPhotos: File[]
    portfolioVideos: File[]
    portfolioClientWork: File[]
    portfolioStudioWork: File[]
    profilePhoto?: File | null
    bankCheque?: File | null
  },
) {
  const rows: StoredMediaFile[] = []
  for (const d of payload.docs) {
    rows.push({
      key: `${vendorId}:doc:${d.id}`,
      vendorId,
      group: 'doc',
      id: d.id,
      label: d.label,
      fileName: d.file.name,
      mime: d.file.type || 'application/octet-stream',
      blob: d.file,
    })
  }
  payload.portfolioPhotos.forEach((file, i) => {
    rows.push({
      key: `${vendorId}:photo:${i}`,
      vendorId,
      group: 'portfolioPhoto',
      id: `photo-${i}`,
      label: `Sample photo ${i + 1}`,
      fileName: file.name,
      mime: file.type,
      blob: file,
    })
  })
  payload.portfolioVideos.forEach((file, i) => {
    rows.push({
      key: `${vendorId}:video:${i}`,
      vendorId,
      group: 'portfolioVideo',
      id: `video-${i}`,
      label: `Sample video ${i + 1}`,
      fileName: file.name,
      mime: file.type,
      blob: file,
    })
  })
  payload.portfolioClientWork.forEach((file, i) => {
    rows.push({
      key: `${vendorId}:client:${i}`,
      vendorId,
      group: 'clientWork',
      id: `client-${i}`,
      label: `Client work ${i + 1}`,
      fileName: file.name,
      mime: file.type,
      blob: file,
    })
  })
  payload.portfolioStudioWork.forEach((file, i) => {
    rows.push({
      key: `${vendorId}:studio:${i}`,
      vendorId,
      group: 'studioWork',
      id: `studio-${i}`,
      label: `Studio / event ${i + 1}`,
      fileName: file.name,
      mime: file.type,
      blob: file,
    })
  })
  if (payload.profilePhoto) {
    rows.push({
      key: `${vendorId}:profile`,
      vendorId,
      group: 'profile',
      id: 'profile',
      label: 'Profile photo',
      fileName: payload.profilePhoto.name,
      mime: payload.profilePhoto.type,
      blob: payload.profilePhoto,
    })
  }
  if (payload.bankCheque) {
    rows.push({
      key: `${vendorId}:bankCheque`,
      vendorId,
      group: 'bankCheque',
      id: 'bankCheque',
      label: 'Cancelled cheque / bank proof',
      fileName: payload.bankCheque.name,
      mime: payload.bankCheque.type || 'application/octet-stream',
      blob: payload.bankCheque,
    })
  }

  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const idx = store.index('vendorId')
    const req = idx.getAll(vendorId)
    req.onsuccess = () => {
      for (const row of req.result as StoredMediaFile[]) {
        if (row.group !== 'bankCheque') store.delete(row.key)
      }
      for (const row of rows) store.put(row)
    }
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}

async function uploadOne(
  vendorId: string,
  group: StoredMediaFile['group'],
  id: string,
  label: string,
  file: File,
) {
  const bucket = kycBucket(group)
  const path = storagePath(vendorId, group, id, file.name)
  await storageUpload(bucket, path, file)
  await apiRegisterMedia({
    vendorCode: vendorId,
    mediaGroup: group,
    docId: group === 'doc' ? id : undefined,
    label,
    fileName: file.name,
    storageBucket: bucket,
    storagePath: path,
    mimeType: file.type || 'application/octet-stream',
  })
}

function dbRowToStored(row: DbMediaRow, blob: Blob): StoredMediaFile {
  const url =
    row.storage_bucket === 'vendor-portfolios' ? storagePublicUrl(row.storage_bucket, row.storage_path) : undefined
  return {
    key: row.storage_path,
    vendorId: row.vendor_code,
    group: row.media_group as StoredMediaFile['group'],
    id: row.doc_id ?? row.id,
    label: row.label,
    fileName: row.file_name,
    mime: row.mime_type ?? blob.type,
    blob,
    url,
  }
}

export async function saveVendorMedia(
  vendorId: string,
  payload: {
    docs: { id: string; label: string; file: File }[]
    portfolioPhotos: File[]
    portfolioVideos: File[]
    portfolioClientWork: File[]
    portfolioStudioWork: File[]
    profilePhoto?: File | null
    bankCheque?: File | null
  },
): Promise<void> {
  if (!isSupabaseBackend()) {
    await localSaveVendorMedia(vendorId, payload)
    return
  }

  for (const d of payload.docs) {
    await uploadOne(vendorId, 'doc', d.id, d.label, d.file)
  }
  for (let i = 0; i < payload.portfolioPhotos.length; i++) {
    const file = payload.portfolioPhotos[i]!
    await uploadOne(vendorId, 'portfolioPhoto', `photo-${i}`, `Sample photo ${i + 1}`, file)
  }
  for (let i = 0; i < payload.portfolioVideos.length; i++) {
    const file = payload.portfolioVideos[i]!
    await uploadOne(vendorId, 'portfolioVideo', `video-${i}`, `Sample video ${i + 1}`, file)
  }
  for (let i = 0; i < payload.portfolioClientWork.length; i++) {
    const file = payload.portfolioClientWork[i]!
    await uploadOne(vendorId, 'clientWork', `client-${i}`, `Client work ${i + 1}`, file)
  }
  for (let i = 0; i < payload.portfolioStudioWork.length; i++) {
    const file = payload.portfolioStudioWork[i]!
    await uploadOne(vendorId, 'studioWork', `studio-${i}`, `Studio / event ${i + 1}`, file)
  }
  if (payload.profilePhoto) {
    await uploadOne(vendorId, 'profile', 'profile', 'Profile photo', payload.profilePhoto)
  }
  if (payload.bankCheque) {
    await uploadOne(vendorId, 'bankCheque', 'bankCheque', 'Cancelled cheque / bank proof', payload.bankCheque)
  }
}

export async function saveBankChequeMedia(vendorId: string, file: File): Promise<string> {
  if (!isSupabaseBackend()) {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put({
        key: `${vendorId}:bankCheque`,
        vendorId,
        group: 'bankCheque',
        id: 'bankCheque',
        label: 'Cancelled cheque / bank proof',
        fileName: file.name,
        mime: file.type || 'application/octet-stream',
        blob: file,
      })
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    db.close()
    return `${vendorId}/bank/${file.name}`
  }

  const path = storagePath(vendorId, 'bankCheque', 'bankCheque', file.name)
  await storageUpload('vendor-kyc', path, file)
  await apiRegisterMedia({
    vendorCode: vendorId,
    mediaGroup: 'bankCheque',
    docId: 'bankCheque',
    label: 'Cancelled cheque / bank proof',
    fileName: file.name,
    storageBucket: 'vendor-kyc',
    storagePath: path,
    mimeType: file.type || 'application/octet-stream',
  })
  return path
}

export async function loadVendorMedia(vendorId: string): Promise<StoredMediaFile[]> {
  if (!isSupabaseBackend()) {
    const db = await openDb()
    const rows = await new Promise<StoredMediaFile[]>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).index('vendorId').getAll(vendorId)
      req.onsuccess = () => resolve(req.result as StoredMediaFile[])
      req.onerror = () => reject(req.error)
    })
    db.close()
    return rows
  }

  const rows = await apiListMedia(vendorId)
  const out: StoredMediaFile[] = []
  for (const row of rows) {
    const blob = await storageDownload(row.storage_bucket, row.storage_path)
    out.push(dbRowToStored(row, blob))
  }
  return out
}

export function isImageMime(mime: string, fileName: string) {
  return mime.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(fileName)
}

export function isVideoMime(mime: string, fileName: string) {
  return mime.startsWith('video/') || /\.(mp4|mov|webm)$/i.test(fileName)
}
