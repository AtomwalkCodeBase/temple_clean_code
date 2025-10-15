import {
  AddupdateTemple,
  getTempleList,
  AddTempleImages,
  AddTempleGroupData,
  getTempleGroupData,
} from "../services/ConstantServies";
import {
  authAxios,
  authAxiosFilePost,
  authAxiosget,
  authAxiosPost,
} from "./HttpMethod";

export function addupdatetempale(tempale_data) {
  return authAxiosPost(AddupdateTemple, tempale_data);
}

export function gettemplist() {
  return authAxiosget(getTempleList);
}

export function uploadTempleImages(templeId, formData) {
  // If formData is already provided, use it directly
  if (formData instanceof FormData) {
    return authAxiosFilePost(AddTempleImages, formData);
  }

  // Legacy support for array of files
  const legacyFormData = new FormData();
  legacyFormData.append("temple_id", templeId);
  legacyFormData.append("call_mode", "TEMPLE_IMAGE");
  const filesArray = Array.from(formData || []);
  filesArray.forEach((file, index) => {
    const key = index === 0 ? "image_file" : `image_file_${index}`;
    legacyFormData.append(key, file);
  });
  return authAxiosFilePost(AddTempleImages, legacyFormData);
}

export function addTempleGroup(groupData) {
  // If FormData (with image), use file post
  if (groupData instanceof FormData) {
    return authAxiosFilePost(AddTempleGroupData, groupData);
  }
  // If JSON data (without image), use regular post
  return authAxiosPost(AddTempleGroupData, groupData);
}

export function getTempleGroups() {
  return authAxios(getTempleGroupData);
}
