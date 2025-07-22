import { useRouter } from "next/navigation";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function PropertyCard({ property, onEdit, onDelete, onAssignTenant }) {
  const router = useRouter();

  const getPropertyTypeIcon = (type) => {
    const icons = {
      house: "🏠",
      flat: "🏢",
      studio: "🏠",
      shared: "🏘️",
      student: "🎓"
    };
    return icons[type] || "🏠";
  };

  const formatAddress = (property) => {
    const parts = [
      property.addressLine1,
      property.addressLine2,
      property.city,
      property.county,
      property.postcode
    ].filter(Boolean);
    return parts.join(", ");
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons
    if (e.target.closest('button')) {
      return;
    }
    router.push(`/properties/${property.id}`);
  };

  return (
    <Card 
      borderColor="accent-teal" 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getPropertyTypeIcon(property.propertyType)}</span>
          <div>
            <h3 className="text-xl font-bold text-accent-teal">{property.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{property.propertyType}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(property);
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(property.id);
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Address */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-1">Address</h4>
          <p className="text-sm text-gray-600">{formatAddress(property)}</p>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-1">Bedrooms</h4>
            <p className="text-sm text-gray-600">{property.bedrooms}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-1">Bathrooms</h4>
            <p className="text-sm text-gray-600">{property.bathrooms}</p>
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-1">Description</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
          </div>
        )}

        {/* Documents */}
        {property.documents && property.documents.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-1">Documents</h4>
            <div className="flex flex-wrap gap-2">
              {property.documents.slice(0, 3).map((doc, index) => (
                <span key={index} className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs">
                  📄 {doc.name}
                </span>
              ))}
              {property.documents.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{property.documents.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tenants */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-1">Tenants</h4>
          {property.memberships && property.memberships.length > 0 ? (
            <div className="space-y-1">
              {property.memberships.map(membership => (
                <div key={membership.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {membership.user.username} ({membership.role})
                  </span>
                  {membership.role === 'tenant' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignTenant(property.id, membership.user.id, 'remove');
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No tenants assigned</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAssignTenant(property.id);
            }}
            className="flex-1"
          >
            Manage Tenants
          </Button>
        </div>
      </div>
    </Card>
  );
} 