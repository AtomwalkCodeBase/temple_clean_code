import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  addTempleGroup,
  getTempleGroups,
} from "../../services/productServices";

// Styled Components (same as before, but with additions)
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
`;

const CardTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const FileInput = styled.input`
  padding: 12px;
  border: 2px dashed #e1e8ed;
  border-radius: 8px;
  font-size: 14px;
  background: #f8f9fa;

  &::file-selector-button {
    background: #3498db;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    margin-right: 10px;
  }
`;

const Button = styled.button`
  background: ${(props) =>
    props.variant === "secondary" ? "#95a5a6" : "#3498db"};
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${(props) =>
      props.variant === "secondary" ? "#7f8c8d" : "#2980b9"};
    transform: translateY(-2px);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const Notice = styled.div`
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  font-weight: 500;
  text-align: center;

  ${(props) =>
    props.type === "error" &&
    `
    background: #ffeaea;
    color: #e74c3c;
    border: 1px solid #e74c3c;
  `}

  ${(props) =>
    props.type === "success" &&
    `
    background: #e8f6ef;
    color: #27ae60;
    border: 1px solid #27ae60;
  `}
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e1e8ed;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  background: #e1e8ed;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
`;

const ItemType = styled.span`
  font-size: 12px;
  color: #7f8c8d;
  text-transform: uppercase;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #7f8c8d;

  &:hover {
    background: #e1e8ed;
    color: #2c3e50;
  }

  ${(props) =>
    props.variant === "edit" &&
    `
    &:hover {
      background: #3498db;
      color: white;
    }
  `}

  ${(props) =>
    props.variant === "delete" &&
    `
    &:hover {
      background: #e74c3c;
      color: white;
    }
  `}
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
`;

const EditBadge = styled.span`
  background: #3498db;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

const ImagePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
`;

const PreviewImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: #c0392b;
  }
`;

const TempleGroup = () => {
  const [groups, setGroups] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [groupForm, setGroupForm] = useState({
    name: "",
    image: null,
    imagePreview: null,
  });
  const [subGroupForm, setSubGroupForm] = useState({
    name: "",
    image: null,
    imagePreview: null,
    parentGroup: "",
  });

  const [editingGroup, setEditingGroup] = useState(null);
  const [editingSubGroup, setEditingSubGroup] = useState(null);

  // Initialize data
  useEffect(() => {
    fetchTempleGroups();
  }, []);

  const resetNotices = () => {
    setError("");
    setSuccess("");
  };

  const fetchTempleGroups = async () => {
    setLoading(true);
    try {
      const response = await getTempleGroups();
      const data = response?.data?.data || response?.data || [];
      const groupsData = data.filter((item) => item.group_type === "T");
      const subGroupsData = data.filter((item) => item.group_type === "S");
      setGroups(groupsData);
      setSubGroups(subGroupsData);
    } catch (err) {
      setError("Failed to fetch temple groups");
      console.error("Error fetching temple groups:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    if (!groupForm.name.trim()) {
      setError("Group name is required");
      return;
    }

    setSaving(true);
    resetNotices();

    try {
      const formData = new FormData();
      formData.append("name", groupForm.name.trim());
      formData.append("group_type", "T");
      formData.append("call_mode", editingGroup ? "UPDATE" : "ADD");

      if (editingGroup) {
        formData.append("group_id", editingGroup.id);
      }

      if (groupForm.image) {
        formData.append("image", groupForm.image);
      }

      await addTempleGroup(formData);
      setSuccess(`Group ${editingGroup ? "updated" : "created"} successfully!`);

      // Reset form and refresh data
      resetGroupForm();
      await fetchTempleGroups();
    } catch (err) {
      console.error("Error saving group:", err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to save group"
      );
    } finally {
      removeImage("group");
      setSaving(false);
    }
  };

  const handleSubGroupSubmit = async (e) => {
    e.preventDefault();
    if (!subGroupForm.name.trim()) {
      setError("Sub group name is required");
      return;
    }

    setSaving(true);
    resetNotices();

    try {
      const formData = new FormData();
      formData.append("name", subGroupForm.name.trim());
      formData.append("group_type", "S");
      formData.append("call_mode", editingSubGroup ? "UPDATE" : "ADD");

      if (editingSubGroup) {
        const subGroupId = editingSubGroup.id || editingSubGroup.group_id;
        if (!subGroupId) {
          throw new Error("Sub Group ID not found in the data");
        }
        formData.append("group_id", subGroupId);
      }

      if (subGroupForm.image) {
        formData.append("image", subGroupForm.image);
      }

      await addTempleGroup(formData);
      setSuccess(
        `Sub group ${editingSubGroup ? "updated" : "created"} successfully!`
      );

      // Reset form and refresh data
      resetSubGroupForm();
      await fetchTempleGroups();
    } catch (err) {
      console.error("Error saving sub group:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save sub group"
      );
    } finally {
      setSaving(false);
      removeImage();
    }
  };

  // Improved edit handlers with better UX
  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setGroupForm({
      name: group.name,
      image: null,
      imagePreview: group.image || null,
    });
    resetNotices();

    // Scroll to form
    document.getElementById("group-form-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleEditSubGroup = (subGroup) => {
    setEditingSubGroup(subGroup);
    setSubGroupForm({
      name: subGroup.name,
      image: null,
      imagePreview: subGroup.image || null,
      parentGroup: subGroup.parent_id || "",
    });
    resetNotices();

    // Scroll to form
    document.getElementById("subgroup-form-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Proper form reset functions
  const resetGroupForm = () => {
    setGroupForm({
      name: "",
      image: null,
      imagePreview: null,
    });
    setEditingGroup(null);
  };

  const resetSubGroupForm = () => {
    setSubGroupForm({
      name: "",
      image: null,
      imagePreview: null,
      parentGroup: "",
    });
    setEditingSubGroup(null);
  };

  const cancelEdit = () => {
    resetGroupForm();
    resetSubGroupForm();
    resetNotices();
  };

  const handleImageChange = (e, formType) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (formType === "group") {
        setGroupForm((prev) => ({
          ...prev,
          image: file,
          imagePreview: previewUrl,
        }));
      } else {
        setSubGroupForm((prev) => ({
          ...prev,
          image: file,
          imagePreview: previewUrl,
        }));
      }
    }
  };

  const removeImage = (formType) => {
    if (formType === "group") {
      setGroupForm((prev) => ({
        ...prev,
        image: null,
        imagePreview: null,
      }));
      // Reset file input
      document.getElementById("groupImage").value = "";
    } else {
      setSubGroupForm((prev) => ({
        ...prev,
        image: null,
        imagePreview: null,
      }));
      // Reset file input
      document.getElementById("subGroupImage").value = "";
    }
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (groupForm.imagePreview) {
        URL.revokeObjectURL(groupForm.imagePreview);
      }
      if (subGroupForm.imagePreview) {
        URL.revokeObjectURL(subGroupForm.imagePreview);
      }
    };
  }, [groupForm.imagePreview, subGroupForm.imagePreview]);

  return (
    <Container>
      {/* Notices */}
      {error && <Notice type="error">{error}</Notice>}
      {success && <Notice type="success">{success}</Notice>}

      <Grid>
        {/* Groups Section */}
        <Card id="group-form-section">
          <CardTitle>
            {editingGroup ? (
              <>
                Edit Group
                <EditBadge>Editing: {editingGroup.name}</EditBadge>
              </>
            ) : (
              "Create New Group"
            )}
          </CardTitle>

          <Form onSubmit={handleGroupSubmit}>
            <FormGroup>
              <Label htmlFor="groupName">Group Name *</Label>
              <Input
                id="groupName"
                type="text"
                value={groupForm.name}
                onChange={(e) =>
                  setGroupForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter group name"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="groupImage">Group Image</Label>
              <FileInput
                id="groupImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "group")}
              />

              {/* Image Preview */}
              {(groupForm.imagePreview || editingGroup?.image) && (
                <ImagePreview>
                  <PreviewImage
                    src={groupForm.imagePreview || editingGroup.image}
                    alt="Preview"
                  />
                  <RemoveImageButton
                    type="button"
                    onClick={() => removeImage("group")}
                  >
                    Remove
                  </RemoveImageButton>
                </ImagePreview>
              )}
            </FormGroup>

            <ButtonGroup>
              <Button type="submit" disabled={saving}>
                {saving && <LoadingSpinner />}
                {editingGroup ? "Update Group" : "Create Group"}
              </Button>
              {(editingGroup || editingSubGroup) && (
                <Button type="button" variant="secondary" onClick={cancelEdit}>
                  Cancel Edit
                </Button>
              )}
            </ButtonGroup>
          </Form>

          <CardTitle style={{ marginTop: "40px" }}>Existing Groups</CardTitle>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <LoadingSpinner />
            </div>
          ) : groups.length === 0 ? (
            <EmptyState>No groups created yet</EmptyState>
          ) : (
            <List>
              {groups.map((group) => (
                <ListItem
                  key={group.id}
                  style={{
                    border:
                      editingGroup?.id === group.id
                        ? "2px solid #3498db"
                        : "1px solid #e1e8ed",
                    background:
                      editingGroup?.id === group.id ? "#ebf5fb" : "#f8f9fa",
                  }}
                >
                  <ItemInfo>
                    <ItemImage
                      src={group.image || "/api/placeholder/50/50"}
                      alt={group.name}
                    />
                    <ItemDetails>
                      <ItemName>{group.name}</ItemName>
                      <ItemType>Group</ItemType>
                    </ItemDetails>
                  </ItemInfo>
                  <ActionButtons>
                    <IconButton
                      variant="edit"
                      onClick={() => handleEditGroup(group)}
                      title="Edit group"
                      style={{
                        background:
                          editingGroup?.id === group.id
                            ? "#3498db"
                            : "transparent",
                        color:
                          editingGroup?.id === group.id ? "white" : "#7f8c8d",
                      }}
                    >
                      ✏️
                    </IconButton>
                  </ActionButtons>
                </ListItem>
              ))}
            </List>
          )}
        </Card>

        {/* Sub Groups Section */}
        <Card id="subgroup-form-section">
          <CardTitle>
            {editingSubGroup ? (
              <>
                Edit Sub Group
                <EditBadge>Editing: {editingSubGroup.name}</EditBadge>
              </>
            ) : (
              "Create New Sub Group"
            )}
          </CardTitle>

          <Form onSubmit={handleSubGroupSubmit}>
            <FormGroup>
              <Label htmlFor="subGroupName">Sub Group Name *</Label>
              <Input
                id="subGroupName"
                type="text"
                value={subGroupForm.name}
                onChange={(e) =>
                  setSubGroupForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter sub group name"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="subGroupImage">Sub Group Image</Label>
              <FileInput
                id="subGroupImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "subGroup")}
              />

              {/* Image Preview */}
              {(subGroupForm.imagePreview || editingSubGroup?.image) && (
                <ImagePreview>
                  <PreviewImage
                    src={subGroupForm.imagePreview || editingSubGroup.image}
                    alt="Preview"
                  />
                  <RemoveImageButton
                    type="button"
                    onClick={() => removeImage("subGroup")}
                  >
                    Remove
                  </RemoveImageButton>
                </ImagePreview>
              )}
            </FormGroup>

            <ButtonGroup>
              <Button type="submit" disabled={saving}>
                {saving && <LoadingSpinner />}
                {editingSubGroup ? "Update Sub Group" : "Create Sub Group"}
              </Button>
              {(editingGroup || editingSubGroup) && (
                <Button type="button" variant="secondary" onClick={cancelEdit}>
                  Cancel Edit
                </Button>
              )}
            </ButtonGroup>
          </Form>

          <CardTitle style={{ marginTop: "40px" }}>
            Existing Sub Groups
          </CardTitle>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <LoadingSpinner />
            </div>
          ) : subGroups.length === 0 ? (
            <EmptyState>No sub groups created yet</EmptyState>
          ) : (
            <List>
              {subGroups.map((subGroup) => {
                const parentGroup = groups.find(
                  (g) => g.id === subGroup.parent_id
                );
                return (
                  <ListItem
                    key={subGroup.id}
                    style={{
                      border:
                        editingSubGroup?.id === subGroup.id
                          ? "2px solid #3498db"
                          : "1px solid #e1e8ed",
                      background:
                        editingSubGroup?.id === subGroup.id
                          ? "#ebf5fb"
                          : "#f8f9fa",
                    }}
                  >
                    <ItemInfo>
                      <ItemImage
                        src={subGroup.image || "/api/placeholder/50/50"}
                        alt={subGroup.name}
                      />
                      <ItemDetails>
                        <ItemName>{subGroup.name}</ItemName>
                        <ItemType>
                          Sub Group {parentGroup && `• ${parentGroup.name}`}
                        </ItemType>
                      </ItemDetails>
                    </ItemInfo>
                    <ActionButtons>
                      <IconButton
                        variant="edit"
                        onClick={() => handleEditSubGroup(subGroup)}
                        title="Edit sub group"
                        style={{
                          background:
                            editingSubGroup?.id === subGroup.id
                              ? "#3498db"
                              : "transparent",
                          color:
                            editingSubGroup?.id === subGroup.id
                              ? "white"
                              : "#7f8c8d",
                        }}
                      >
                        ✏️
                      </IconButton>
                    </ActionButtons>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Card>
      </Grid>
    </Container>
  );
};

export default TempleGroup;
