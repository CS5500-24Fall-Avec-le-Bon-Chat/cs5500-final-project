"use client";

export default function FundraiserPage() {
  return (
    <div className="flex justify-center mt-64 mx-auto w-3/4 max-w-2xl flex-col gap-5">
      <h2>Fundraiser Page</h2>
      <p>This page will have 3 vertical columns.</p>
        <li>1: Event List</li>
        <li>2: Event Details</li>
        <li>3: List of Tasks or List of Donors, conditinally rendering</li>
    </div>
  );
}
