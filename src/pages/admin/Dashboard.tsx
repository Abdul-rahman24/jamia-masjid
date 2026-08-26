import { Card, CardContent } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { Clock, ClipboardList } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function Dashboard() {
  const { resources, rentalRequests, janaazahSubmissions, nikahSubmissions } = useData();
  const pendingRentals = rentalRequests.filter(r => r.status === 'Pending').length;
  const pendingJan = janaazahSubmissions.filter(j => j.status === 'Pending').length;
  const pendingNik = nikahSubmissions.filter(n => n.status === 'Pending').length;
  const totalPending = pendingRentals + pendingJan + pendingNik;

  const getResourceName = (id: string) => resources.find(r => r.id === id)?.name || 'Resource';

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard 
          title="Pending Submissions" 
          value={totalPending} 
          icon={<ClipboardList size={24} className="text-yellow-600" />} 
          link="/admin/submissions" 
        />
        <StatCard 
          title="Prayer Times" 
          value="Manage" 
          icon={<Clock size={24} className="text-[var(--color-primary)]" />} 
          link="/admin/prayers" 
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Recent Rentals */}
        <Card>
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-sm font-bold text-gray-900">Recent Rentals</h2>
            <Link to="/admin/submissions" className="text-xs text-[var(--color-primary)] font-medium hover:underline">View All</Link>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {rentalRequests.slice(-5).reverse().map(req => {
                const totalItems = req.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                const firstItemName = req.items && req.items.length > 0 ? getResourceName(req.items[0].resourceId) : 'Items';
                
                return (
                  <div key={req.id} className="p-4 flex justify-between items-start flex-col sm:flex-row sm:items-center gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{req.customerName}</p>
                      <p className="text-xs text-gray-500">{totalItems}x total ({firstItemName}{req.items?.length > 1 ? ' + more' : ''})</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                );
              })}
              {rentalRequests.length === 0 && (
                <div className="p-6 text-center text-sm text-gray-500">No recent requests</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Janaazah */}
        <Card>
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-sm font-bold text-gray-900">Recent Janaazah</h2>
            <Link to="/admin/submissions" className="text-xs text-[var(--color-primary)] font-medium hover:underline">View All</Link>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {janaazahSubmissions.slice(-5).reverse().map(req => (
                <div key={req.id} className="p-4 flex justify-between items-start flex-col sm:flex-row sm:items-center gap-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{req.submitterName}</p>
                    <p className="text-xs text-gray-500">{req.submitterPhone}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
              {janaazahSubmissions.length === 0 && (
                <div className="p-6 text-center text-sm text-gray-500">No recent requests</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Nikah */}
        <Card>
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-sm font-bold text-gray-900">Recent Nikah</h2>
            <Link to="/admin/submissions" className="text-xs text-[var(--color-primary)] font-medium hover:underline">View All</Link>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {nikahSubmissions.slice(-5).reverse().map(req => (
                <div key={req.id} className="p-4 flex justify-between items-start flex-col sm:flex-row sm:items-center gap-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{req.groomName} & {req.brideName}</p>
                    <p className="text-xs text-gray-500">Date: {req.preferredDate}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
              {nikahSubmissions.length === 0 && (
                <div className="p-6 text-center text-sm text-gray-500">No recent requests</div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
      status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
      status === 'Approved' || status === 'Active' ? 'bg-green-100 text-green-800' :
      'bg-gray-100 text-gray-800'
    }`}>
      {status}
    </span>
  );
}

function StatCard({ title, value, icon, link }: { title: string, value: number | string, icon: React.ReactNode, link: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link to={link} className="block p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </Link>
    </Card>
  );
}
