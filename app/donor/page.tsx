"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse"; // For parsing CSV data
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/text-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default function DonorPage() {
  const [donor, setDonor] = useState(null); // Store donor data
  const [donationHistory, setDonationHistory] = useState([]); // Store donation history
  const [loading, setLoading] = useState(false); // Loading state for data fetching
  const [comment, setComment] = useState(""); // Store comment input
  const [view, setView] = useState("basic"); // Toggle between basic and detailed view

  const donorId = 1; // Example donor ID (this could be dynamic based on route or prop)

  //This is ChatGpt code. It tries to use the Donor id to fecch the donor info, but there is no Donor Id in the api so it always fails.
  // Can you filter by user first name and last name? When I tried it, it didn't work.
  useEffect(() => {
    fetchDonorData(donorId);
  }, [donorId]);

  // Function to fetch donor data (fetching CSV data from an API or static source)
  const fetchDonorData = async (id) => {
    setLoading(true); // Set loading state while fetching data
    const url = `https://bc-cancer-faux.onrender.com/donor?&format=csv`; // API URL (replace with your actual API endpoint)
    
    try {
      const response = await fetch(url);
      const csvText = await response.text(); // Get the CSV data as a string

      // Parse the CSV data using PapaParse
      // mock csv I fed Chatgpt. Probably need to alter the fields to match the actual csv
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.data.length > 0) {
            const donorData = result.data[0]; // Use the first row of the data
            setDonor({
              firstName: donorData.first_name,
              lastName: donorData.last_name,
              address: `${donorData.address_line1} ${donorData.address_line2}`,
              city: donorData.city,
              phone: donorData.contact_phone_type,
              email: donorData.email_restrictions,
              communicationPreference: donorData.communication_preference,
              totalDonations: donorData.total_donations,
              largestGift: donorData.largest_gift,
              firstGiftDate: new Date(donorData.first_gift_date * 1000).toLocaleDateString(),
              lastGiftDate: new Date(donorData.last_gift_date * 1000).toLocaleDateString(),
              totalPledge: donorData.total_pledge,
              profileImage: donorData.profile_image_url || "/defaultDonorPhoto.png", // Assuming you have a field for profile image URL
              communicationRestrictions: donorData.communication_restrictions,
              subscriptions: donorData.subscriptions, // Example field
            });

            // Set donation history from the CSV data (assuming the donations are structured in the CSV)
            const donations = [
              {
                amount: donorData.total_donations,
                date: donorData.first_gift_date,
                appeal: donorData.largest_gift_appeal,
              },
              {
                amount: donorData.total_pledge,
                date: donorData.last_gift_date,
                appeal: donorData.last_gift_appeal,
              },
            ];
            setDonationHistory(donations);
          }
        },
      });
    } catch (error) {
      console.error("Error fetching donor data:", error); // Handle errors
    } finally {
      setLoading(false); // Set loading state to false when done
    }
  };

  // Handle comment submission (just logs it to the console)
  const handleSubmitComment = () => {
    console.log("Comment Submitted: ", comment);
    setComment(""); // Clear the comment input after submission
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while data is being fetched
  }

  if (!donor) {
    return <div>No donor data available</div>; // Handle the case where no donor data is found
  }

  return (
    <div className="flex justify-center mt-32 mx-auto w-3/4 max-w-2xl flex-col gap-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/staff">Staff</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Donor</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Donor Basic Info Column */}
        <div className="w-1/3">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>{donor.firstName} {donor.lastName}</CardTitle>
              <CardDescription>Donor Basic Information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-center">
                {/* Donor Profile Image */}
                <img
                  src={donor.profileImage} // Using donor profile image (if available)
                  alt="Profile Photo"
                  className="w-32 h-32 rounded-full mx-auto"
                />
                <div><strong>Name:</strong> {donor.firstName} {donor.lastName}</div>
                <div><strong>Address:</strong> {donor.address}, {donor.city}</div>
                <div><strong>Total Donations:</strong> ${donor.totalDonations}</div>
                <div><strong>Last Gift Date:</strong> {donor.lastGiftDate}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donor Donation History Column (Always visible) */}
        <div className="w-1/3">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg">Donation History</h3>
              <table className="w-full text-left mt-2">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Appeal</th>
                  </tr>
                </thead>
                <tbody>
                  {donationHistory.map((donation, index) => (
                    <tr key={index}>
                      <td>${donation.amount}</td>
                      <td>{new Date(donation.date * 1000).toLocaleDateString()}</td>
                      <td>{donation.appeal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Donor Detailed Info Column (Conditional) */}
        <div className="w-1/3">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Detailed Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><strong>Communication Preferences:</strong> {donor.communicationPreference}</div>
                <div><strong>Communication Restrictions:</strong> {donor.communicationRestrictions}</div>
                <div><strong>Subscriptions:</strong> {donor.subscriptions || "None"}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* right now the comment section only console logs the comments. We can use session storage or local storage to store the comments */}
      {/* Comments Section */}
      <Card className="shadow-none mt-8">
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add your comments here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-24"
          />
          <Button
            className="mt-2 w-full"
            variant="outline"
            onClick={handleSubmitComment}
          >
            Submit Comment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}