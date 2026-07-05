import { apiBaseUrl, assetBaseUrl } from '../config/apiConfig';

const API_BASE_URL = apiBaseUrl;
const ASSET_BASE_URL = assetBaseUrl;

export function getImageUrl(value?: string | null): string {
    if (!value) return '/placeholder.png';

    if (value.startsWith('http://') || value.startsWith('https://')) {
        return value;
    }

    if (value.startsWith('/uploads')) {
        return `${ASSET_BASE_URL}${value}`;
    }

    if (value.startsWith('uploads')) {
        return `${ASSET_BASE_URL}/${value}`;
    }

    if (value.startsWith('wwwroot/uploads')) {
        const normalized = value.replace('wwwroot', '');
        return `${ASSET_BASE_URL}${normalized}`;
    }

    if (value.startsWith('/api/images/')) {
        return `${API_BASE_URL}${value.replace('/api', '')}`;
    }

    if (value.startsWith('/images/')) {
        return `${API_BASE_URL}${value}`;
    }

    return `${API_BASE_URL}/images/${value}`;
}
