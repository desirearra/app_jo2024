/**
 * StatusBadge - Badge coloré pour afficher un statut d'entité (user, order, ticket)
 * @param status string - le statut à afficher (ex: 'Actif', 'Inactif', 'PAID', 'CANCELLED', etc.)
 * @param type 'user' | 'order' | 'ticket' - type d'entité pour adapter la palette
 */
export type StatusBadgeProps = {
  status: string;
  type: 'user' | 'order' | 'ticket';
  className?: string;
};

export function StatusBadge({ status, type, className = '' }: StatusBadgeProps) {
  let color = 'bg-gray-200 text-gray-800';
  // Harmonisation palette
  if (type === 'user') {
    color = status === 'Actif' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';
  } else if (type === 'order') {
    if (status === 'PAID') color = 'bg-green-200 text-green-800';
    else if (status === 'CANCELLED') color = 'bg-red-200 text-red-800';
    else if (status === 'REFUNDED') color = 'bg-blue-200 text-blue-800';
    else if (status === 'PENDING') color = 'bg-yellow-200 text-yellow-800';
  } else if (type === 'ticket') {
    if (status === 'ACTIVE') color = 'bg-green-200 text-green-800';
    else if (status === 'CANCELLED') color = 'bg-red-200 text-red-800';
    else color = 'bg-gray-200 text-gray-800';
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${color} ${className}`}
      style={{ minWidth: 60, textAlign: 'center' }}
    >
      {status}
    </span>
  );
}
