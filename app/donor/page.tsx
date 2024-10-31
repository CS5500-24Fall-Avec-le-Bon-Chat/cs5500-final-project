"use client";

export default function DonorPage() {
  return (
    <div className="flex justify-center mt-64 mx-auto w-3/4 max-w-2xl flex-col gap-5">
      <h2>Donor Page</h2>
      <div className="flex">
        <div className="w-1/3 p-4 border">
          <h3>Donor Basic Info</h3>
          <div className="mb-4">
            <img src="/defaultDonorPhoto.png" alt="Profile Photo" className="w-full h-auto rounded" />
          </div>
          <div className="space-y-2">
            <div>
              <strong>Name:</strong> John Doe
            </div>
            <div>
              <strong>Address:</strong> 123 Main St, Anytown, USA
            </div>
            <div>
              <strong>Birthday:</strong> January 1, 1970
            </div>
          </div>
          <button className="mt-4 p-2 bg-blue-500 text-white rounded">Toggle</button>
        </div>
        <div className="w-2/3 p-4 border">
          <h3>Donor Detail Info/Data Visualization</h3>
          {/* Conditionally render detail info component / data visualization component here */}
        </div>
      </div>
    </div>
  );
}
