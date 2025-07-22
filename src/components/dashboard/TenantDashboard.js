import Card from "../ui/Card";

export default function TenantDashboard({ user }) {
  // Separate memberships by type
  const householdMemberships = user.memberships?.filter(m => m.role === 'tenant' && m.household) || [];
  const propertyMemberships = user.memberships?.filter(m => m.role === 'tenant' && m.property) || [];

  return (
    <Card borderColor="accent-blue" className="max-w-2xl mx-auto w-full flex flex-col items-center gap-4">
      <span className="text-4xl">🧑‍🤝‍🧑</span>
      <h1 className="text-3xl font-bold mb-2 text-accent-blue">Welcome, {user.username}!</h1>
      <p className="text-lg text-center text-gray-700 mb-4">You are a tenant in the following:</p>
      <ul className="w-full space-y-2">
        {householdMemberships.map(m => (
          <li key={m.household.id} className="bg-gray-100 rounded-lg px-4 py-2 flex flex-col">
            <span className="font-semibold">{m.household.name}</span>
            <span className="text-xs text-gray-500">Invite Code: <code>{m.household.inviteCode}</code></span>
          </li>
        ))}
        {propertyMemberships.map(m => (
          <li key={m.property.id} className="bg-gray-100 rounded-lg px-4 py-2 flex flex-col">
            <span className="font-semibold">{m.property.name}</span>
            <span className="text-xs text-gray-500">Type: {m.property.propertyType}</span>
            <span className="text-xs text-gray-500">Address: {m.property.addressLine1}, {m.property.city}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500 mt-4">If you need to join another household or property, ask your landlord for an invite code or link.</p>
    </Card>
  );
} 