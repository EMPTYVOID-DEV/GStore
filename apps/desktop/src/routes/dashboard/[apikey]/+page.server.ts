import { type Actions, redirect, fail } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { env } from '$env/dynamic/private';

interface TrackData {
    apiKey: string;
    name: string;
    path: string;
    isPublic: boolean;
    uploadedAt: string;
    tags: string[];
}

export const load = async ({ params }: { params: { apikey: string }}) => {
    const currentApiKey = params.apikey;

    if (!currentApiKey) {
        return { error: 'API key is required.' };
    }

    try {
        const keyInfoRes = await fetch(`${env.API_HOST}/info/key-info/${currentApiKey}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${currentApiKey}`,
            },
        });

        if (!keyInfoRes.ok) {
            const errorDetails = await keyInfoRes.json();
            return { error: errorDetails.message || "API key doesn't exist!" };
        }

        const apiKeyInfo = await keyInfoRes.json();

        if (!apiKeyInfo.permissions || !apiKeyInfo.permissions.includes('access-metadata')) {
            return { error: 'API key does not have permission to list files.' };
        }

        let tracks: Record<string, TrackData> = {};
        
        if (fs.existsSync(TRACKS_FILE)) {
            try {
                const fileContent = fs.readFileSync(TRACKS_FILE, 'utf-8');
                tracks = JSON.parse(fileContent);
            } catch (err) {
                console.error('Error reading tracks file:', err);
                return { error: 'Failed to read tracks file.' };
            }
        }

        const filesRes = await fetch(`${env.API_HOST}/files/list`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${currentApiKey}`,
            },
        });

        if (!filesRes.ok) {
            const errorDetails = await filesRes.json();
            return { error: errorDetails.message || 'Failed to fetch files.' };
        }

        const remoteFiles = await filesRes.json();

        return { 
            tracks, 
            files: remoteFiles 
        };
    } catch (err) {
        console.error('Load error:', err);
        return { error: 'An unexpected error occurred.' };
    }
};


const TRACKS_FILE = './tracks.json';

export const actions: Actions = {
    upload_to_remote: async ({ request, fetch, params }) => {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const isPublic = formData.get('isPublic') === 'true';
        const tags = formData.get('tags') as string;
        const processedTags = tags.split(',').map((tag) => tag.trim());
        const currentApiKey = params.apikey;

        if (!file || !currentApiKey) {
            return fail(400, { message: 'File and API key are required.' });
        }

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            uploadFormData.append('isPublic', isPublic.toString());
            uploadFormData.append('tags', processedTags.join(','));

            const keyRes = await fetch(`${env.API_HOST}/info/key-info/${currentApiKey}`, {
                method: 'GET',
            });

            if (!keyRes.ok) {
                const errorDetails = await keyRes.json();
                return fail(404, { message: errorDetails.message || "API key doesn't exist!" });
            }

            const apiKeyInfo = await keyRes.json();
            uploadFormData.append('storeId', apiKeyInfo.storeId);

            const res = await fetch(`${env.API_HOST}/files/create`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${currentApiKey}`,
                },
                body: uploadFormData,
            });

            if (!res.ok) {
                const errorDetails = await res.json();
                throw new Error(errorDetails.message || 'File upload failed.');
            }

            const uploadedFile = await res.json();
            return { success: true, file: uploadedFile };
        } catch (err) {
            console.error('Upload error:', err);
            return fail(500, { message: 'Failed to upload file.' });
        }
    },

    upload_to_local: async ({ request, params }) => {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const isPublic = formData.get('isPublic') === 'true';
        const tags = formData.get('tags') as string;
        const processedTags = tags.split(',').map((tag) => tag.trim());
        const currentApiKey = params.apikey;

        if (!file || !currentApiKey) {
            return fail(400, { message: 'File and API key are required.' });
        }

        try {
            const localFilePath = path.resolve(file.name);
            await updateTracksFile(currentApiKey, localFilePath, { id: file.name, name: file.name }, processedTags, isPublic);
            return { success: true };
        } catch (err) {
            console.error('Local upload error:', err);
            return fail(500, { message: 'Failed to save file locally.' });
        }
    },

    delete: async ({ params, request, fetch }) => {
        const formData = await request.formData();
        const fileId = formData.get('fileId') as string;
        const currentApiKey = params.apikey;

        if (!fileId || !currentApiKey) {
            return fail(400, { message: 'File ID and API key are required.' });
        }

        try {
            // Delete file on backend
            const res = await fetch(`${env.API_HOST}/files/delete/${fileId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${currentApiKey}`,
                },
            });

            if (!res.ok) {
                const errorDetails = await res.json();
                throw new Error(errorDetails.message || 'File delete failed.');
            }

            return { success: true, fileId };
        } catch (err) {
            console.error('Delete error:', err);
            return fail(500, { message: 'Failed to delete file.' });
        }
    },

    local_delete: async ({ request }) => {
        const formData = await request.formData();
        const fileId = formData.get('fileId') as string;

        if (!fileId) {
            return fail(400, { message: 'File ID is required.' });
        }

        try {
            const tracks = readTracksFile();
            if (!(fileId in tracks)) {
                return fail(404, { message: 'File record not found.' });
            }

            delete tracks[fileId];
            writeTracksFile(tracks);

            return { success: true, fileId };
        } catch (err) {
            console.error('Local delete error:', err);
            return fail(500, { message: 'Failed to delete file locally.' });
        }
    },
};

function readTracksFile(): Record<string, TrackData> {
    if (!fs.existsSync(TRACKS_FILE)) {
        return {};
    }
    const fileContent = fs.readFileSync(TRACKS_FILE, 'utf-8');
    return JSON.parse(fileContent);
}

function writeTracksFile(tracks: Record<string, TrackData>): void {
    fs.writeFileSync(TRACKS_FILE, JSON.stringify(tracks, null, 2), 'utf-8');
}

async function updateTracksFile(apiKey: string, localFilePath: string, uploadedFile: any, tags: string[], isPublic: boolean) {
    const trackData: TrackData = {
        apiKey,
        name: path.basename(localFilePath),
        path: localFilePath,
        isPublic,
        uploadedAt: new Date().toISOString(),
        tags,
    };

    const tracks = readTracksFile();
    tracks[uploadedFile.id] = trackData;
    writeTracksFile(tracks);
}
