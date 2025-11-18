const localhost = "https://agamandira.com";

const custRefCode = localStorage.getItem("customerRefCode");

export const endpoint = `${localhost}/temple/api`;
export const authEndpoint = `${localhost}/auth`;
export const productEndpoint = `${localhost}/product/api`;
export const customerEndpoint = `${localhost}/customer/api`;

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

//Admin Endpoints
export const ProcessProductCategory = `${productEndpoint}/process_product_category_data/`;
export const ProcessVariationName = `${productEndpoint}/process_variation_name/`;


//Seller endpoints
export const GetSellerTempleList = `${customerEndpoint}/get_seller_temple_list/`;
export const GetSellerApplicationList = `${customerEndpoint}/get_seller_temple_list/?seller_ref_code=${custRefCode}`;
export const UpdateSellerApplicationStatus = `${customerEndpoint}/seller_update/`;
export const ProcessProductData = `${productEndpoint}/process_product_data/`;
export const GetProductList = `${productEndpoint}/get_product_list/`;
export const GetProductDetailList = `${productEndpoint}/get_product_detail_list/`;
export const GetProductCategoryList = `${productEndpoint}/get_product_category_list/`;
export const GetAllSellerList = `${customerEndpoint}/get_seller_list/`;
export const GetVariationList = `${productEndpoint}/variation_name_list/`;
export const ProcessProductVariations = `${productEndpoint}/process_product_variations/`;
export const ProcessProductVariationImages = `${productEndpoint}/process_product_variation_images/`;

