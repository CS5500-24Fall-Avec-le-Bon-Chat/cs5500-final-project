"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/text-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GetDonors } from "@/lib/api/donor.api";
import { useSearchParams } from "next/navigation";
import { IDonor } from "@/types/donor.types";
import { formatTime } from "@/lib/utils";

import {formatTime} from "@/lib/utils";
import FontSizeAndTheme from "@/components/ui/FontSizeAndTheme";
export default function DonorPage() {
  const params = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [donor, setDonor] = useState<IDonor>(); // Store donor data
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [commentsInput, setCommentsInput] = useState(""); // Store comments input
  const [comments, setComments] = useState<string[]>([]); // Store comments
  const [username, setUsername] = useState(""); // Toggle between basic and detailed view

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
  }, []);

  useEffect(() => {
    const name = decodeURIComponent(params.get("name")!);
    setFirstName(name.split(" ")[0]);
    setLastName(name.split(" ")[1]);
  }, [params]);

  //This is ChatGpt code. It tries to use the Donor id to fecch the donor info, but there is no Donor Id in the api so it always fails.
  // Can you filter by user first name and last name? When I tried it, it didn't work.
  useEffect(() => {
    fetchDonorData();
    fetchComments();
  }, [firstName, lastName]);

  // Function to fetch donor data (fetching CSV data from an API or static source)
  const fetchDonorData = async () => {
    setLoading(true); // Set loading state while fetching data
    // const url = `https://bc-cancer-faux.onrender.com/donors?format=json`; // API URL (replace with your actual API endpoint)

    try {
      // const response = await fetch(url);
      const donors = await GetDonors(); // Get the CSV data as a string

      const donor = donors.filter(
        (donor) =>
          donor.first_name === firstName && donor.last_name === lastName,
      )[0];

      setDonor(donor);
    } catch (error) {
      console.error("Error fetching donor data:", error); // Handle errors
    } finally {
      setLoading(false); // Set loading state to false when done
    }
  };

  const fetchComments = () => {
    const lsComments = JSON.parse(localStorage.getItem("comments") || "{}");
    const donorComments = lsComments[`${firstName} ${lastName}`] || [];
    setComments(donorComments);
  };

  // Handle comments submission (just logs it to the console)
  const handleSubmitComment = () => {
    const lsComments = JSON.parse(localStorage.getItem("comments") || "{}");
    const donorComments = lsComments[`${firstName} ${lastName}`] || [];
    const newComments = {
      ...lsComments,
      [`${firstName} ${lastName}`]: [...donorComments, commentsInput],
    };
    localStorage.setItem("comments", JSON.stringify(newComments));
    setCommentsInput(""); // Clear the comments input after submission
    fetchComments();
  };

  if (loading || !donor) {
    return <div>Loading...</div>; // Show loading indicator while data is being fetched
  }

  return (
    <div className="flex justify-center mt-32 mx-auto w-3/4 max-w-2xl flex-col gap-8">
      <>
      <FontSizeAndTheme/>
      </>
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/staff">Friends</BreadcrumbLink>
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
              <CardTitle>
                {donor.first_name} {donor.last_name}
              </CardTitle>
              <CardDescription>Donor Basic Information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 ">
                {/* Donor Profile Image */}
                <img
                  src={"/defaultDonorPhoto.png"} // Using donor profile image (if available)
                  alt="Profile Photo"
                  className="w-32 h-32 rounded-full mx-auto"
                />
                <div>
                  <strong>Name:</strong> {donor.first_name} {donor.last_name}
                </div>
                <div>
                  <strong>Address:</strong> {donor.address_line1},{" "}
                  {donor.address_line2}, {donor.city}
                </div>
              </div>
            </CardContent>
          </Card>
          <div>
          {/*add a button to navigate back to the fundraiser page */}
          <Button
            className="mt-2 w-full"
            variant="outline"
            onClick={() => {
              window.location.href = "/fundraiser";
            }}>
              Back to Fundraiser Page
              </Button>
        </div>
        </div>
        
        {/* Donor Donation History Column (Always visible) */}
        {/*<div className="w-1/3">*/}
        {/*  <Card className="shadow-none">*/}
        {/*    <CardHeader>*/}
        {/*      <CardTitle>Donation History</CardTitle>*/}
        {/*    </CardHeader>*/}
        {/*    <CardContent>*/}
        {/*      <h3 className="text-lg">Donation History</h3>*/}
        {/*      <table className="w-full text-left mt-2">*/}
        {/*        <thead>*/}
        {/*          <tr>*/}
        {/*            <th>Amount</th>*/}
        {/*            <th>Date</th>*/}
        {/*            <th>Appeal</th>*/}
        {/*          </tr>*/}
        {/*        </thead>*/}
        {/*        <tbody>*/}
        {/*          {donationHistory.map((donation, index) => (*/}
        {/*            <tr key={index}>*/}
        {/*              <td>${donation.amount}</td>*/}
        {/*              <td>*/}
        {/*                {new Date(donation.date * 1000).toLocaleDateString()}*/}
        {/*              </td>*/}
        {/*              <td>{donation.appeal}</td>*/}
        {/*            </tr>*/}
        {/*          ))}*/}
        {/*        </tbody>*/}
        {/*      </table>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}
        {/*</div>*/}

        {/* Donor Detailed Info Column (Conditional) */}
        <div className="w-2/3">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Detailed Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Total Donations:</strong> ${donor.total_donations}
                </div>
                <div>
                  <strong>Last Gift Amount:</strong> ${donor.last_gift_amount}
                </div>
                <div>
                  <strong>Last Gift Date:</strong>{" "}
                  {formatTime(donor.last_gift_date)}
                </div>
                <div>
                  <strong>Communication Preferences:</strong>{" "}
                  {donor.communication_preference}
                </div>
                <div>
                  <strong>Communication Restrictions:</strong>{" "}
                  {donor.communication_restrictions}
                </div>
                <div>
                  <strong>Subscriptions:</strong>{" "}
                  {donor.subscription_events_in_person || "None"}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none mt-4">
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {comments.map((comment, index) => (
                  <div key={index} className="bg-gray-100 p-2 rounded-md">
                    {comment}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* right now the comments section only console logs the comments. We can use session storage or local storage to store the comments */}
      {/* Comments Section */}
      <Card className="shadow-none mt-8">
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add your comments here..."
            value={commentsInput}
            onChange={(e) => setCommentsInput(e.target.value)}
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
