import { FileQuestion } from "lucide-react";

export const EmptySplash = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[75vh] text-center">
      <div className="mb-4 p-6 rounded-full bg-gray-100 text-gray-600">
        <FileQuestion className="h-16 w-16" />
      </div>
      <h1 className="text-2xl font-semibold text-gray-800">No Form Found</h1>
      <p className="mt-2 text-gray-600">
        It seems like there’s nothing here. Start by adding some data to see it
        appear!
      </p>
    </div>
  );
};
