import { useQuery } from '@tanstack/react-query';
import fetchWrapper from '../lib/api';
import supabase from '../lib/supabase';
import useStore from '../store';

export default function Files() {
  const { role } = useStore();
  const { data: files, isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: () => fetchWrapper('/files'),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">Files</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Student ID</th>
            <th className="border p-2">Class ID</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files?.map((file) => (
            <tr key={file.id}>
              <td className="border p-2">{file.name}</td>
              <td className="border p-2">{file.type}</td>
              <td className="border p-2">{file.student_id || 'N/A'}</td>
              <td className="border p-2">{file.class_id || 'N/A'}</td>
              <td className="border p-2">
                <a
                  href={
                    supabase.storage
                      .from('school-files')
                      .getPublicUrl(file.path).data.publicUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  Download
                </a>
                {role === 'admin' && (
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="ml-2 text-red-500"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this file?')) {
      fetchWrapper(`/files/${id}`, { method: 'DELETE' })
        .then(() => {
          queryClient.invalidateQueries(['files']);
        })
        .catch((error) => alert(error.message));
    }
  }
}
