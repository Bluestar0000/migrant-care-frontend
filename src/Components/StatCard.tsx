
export default function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-center">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}