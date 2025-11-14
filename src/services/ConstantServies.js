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
export const getduelists = `${endpoint}/get_due_at_list/`;
export const blockservicedates = `${endpoint}/process_service_not_available/`;
export const getblockedservicedates = `${endpoint}/get_service_not_available_list/`;
