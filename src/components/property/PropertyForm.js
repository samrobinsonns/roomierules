"use client";
import { useState } from "react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function PropertyForm({ property = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: property?.name || "",
    addressLine1: property?.addressLine1 || "",
    addressLine2: property?.addressLine2 || "",
    city: property?.city || "",
    county: property?.county || "",
    postcode: property?.postcode || "",
    propertyType: property?.propertyType || "house",
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    description: property?.description || "",
  });
  const [documents, setDocuments] = useState(property?.documents || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const propertyTypes = [
    { value: "house", label: "House" },
    { value: "flat", label: "Flat/Apartment" },
    { value: "studio", label: "Studio" },
    { value: "shared", label: "Shared House" },
    { value: "student", label: "Student Accommodation" },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      file: file,
      uploadedAt: new Date().toISOString()
    }));
    setDocuments(prev => [...prev, ...newDocuments]);
  };

  const removeDocument = (docId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add property data
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Add documents
      documents.forEach(doc => {
        if (doc.file) {
          submitData.append('documents', doc.file);
        }
      });

      await onSubmit(submitData, property?.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card borderColor="accent-teal" className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-accent-teal">
        {property ? "Edit Property" : "Add New Property"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Property Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
          <select
            value={formData.propertyType}
            onChange={(e) => handleInputChange("propertyType", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-base focus:ring-2 focus:ring-primary"
          >
            {propertyTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Address Fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Address</h3>
          <Input
            placeholder="Address Line 1"
            value={formData.addressLine1}
            onChange={(e) => handleInputChange("addressLine1", e.target.value)}
            required
          />
          <Input
            placeholder="Address Line 2 (optional)"
            value={formData.addressLine2}
            onChange={(e) => handleInputChange("addressLine2", e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="City"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              required
            />
            <Input
              placeholder="County"
              value={formData.county}
              onChange={(e) => handleInputChange("county", e.target.value)}
              required
            />
            <Input
              placeholder="Postcode"
              value={formData.postcode}
              onChange={(e) => handleInputChange("postcode", e.target.value.toUpperCase())}
              required
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <select
                value={formData.bedrooms}
                onChange={(e) => handleInputChange("bedrooms", parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-base focus:ring-2 focus:ring-primary"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
              <select
                value={formData.bathrooms}
                onChange={(e) => handleInputChange("bathrooms", parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-base focus:ring-2 focus:ring-primary"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
          <textarea
            placeholder="Property description..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-base focus:ring-2 focus:ring-primary min-h-[100px] resize-vertical"
          />
        </div>

        {/* Documents Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Documents</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="document-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label htmlFor="document-upload" className="cursor-pointer">
              <div className="text-gray-600">
                <span className="text-2xl">📄</span>
                <p className="mt-2">Click to upload documents</p>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX, JPG, PNG (max 10MB each)</p>
              </div>
            </label>
          </div>

          {/* Document List */}
          {documents.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Uploaded Documents:</h4>
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📄</span>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeDocument(doc.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-red-600 font-medium">{error}</div>
        )}

        {/* Form Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : (property ? "Update Property" : "Add Property")}
          </Button>
        </div>
      </form>
    </Card>
  );
} 