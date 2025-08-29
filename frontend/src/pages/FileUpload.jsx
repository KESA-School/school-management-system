import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../lib/supabase';
import fetchWrapper from '../lib/api';
import useStore from '../store';
import toast from 'react-hot-toast';

export default function FileUpload() {
  const { role, user } = useStore();
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ file, metadata }) => {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('school-files')
        .upload(`${user.id}/${file.name}`, file);
      if (uploadError) throw uploadError;

      const { data, error } = await fetchWrapper('/files', {
        method: 'POST',
        body: JSON.stringify({
          ...metadata,
          path: uploadData.path,
          uploaded_by: user.id,
        }),
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['files']);
      toast.success(id ? 'File updated' : 'File created');
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const metadata = {
      name: file.name,
      student_id: formData.get('student_id') || undefined,
      class_id: formData.get('class_id') || undefined,
      type: formData.get('type'),
    };
    mutation.mutate({ file, metadata });
  };

  if (!['admin', 'teacher'].includes(role)) return <div>Unauthorized</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">Upload File</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Student ID</label>
          <input
            name="student_id"
            className="w-full p-2 border rounded"
            placeholder="UUID (optional)"
          />
        </div>
        <div>
          <label className="block">Class ID</label>
          <input
            name="class_id"
            className="w-full p-2 border rounded"
            placeholder="UUID (optional)"
          />
        </div>
        <div>
          <label className="block">Type</label>
          <select name="type" className="w-full p-2 border rounded" required>
            <option value="assignment">Assignment</option>
            <option value="document">Document</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
