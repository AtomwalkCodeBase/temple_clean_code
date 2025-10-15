const localhost = "https://agamandira.com";

export const endpoint = `${localhost}/temple/api`;
export const authEndpoint = `${localhost}/auth`;

// Auth endpoints
export const loginEndpoint = `${authEndpoint}/login/`;

// Temple endpoints
export const AddupdateTemple = `${endpoint}/process_temple_data/`;
export const getTempleList = `${endpoint}/get_temple_list/`;
export const AddTempleImages = `${endpoint}/process_temple_images/`;
export const AddTempleGroupData = `${endpoint}/process_temple_group_data/`;
export const getTempleGroupData = `${endpoint}/get_temple_group_list/`;
