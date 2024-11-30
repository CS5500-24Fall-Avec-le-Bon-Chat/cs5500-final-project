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
import FontSizeAndTheme from "@/components/ui/FontSizeAndTheme";

export default function DonorPage() {
  const params = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [donor, setDonor] = useState<IDonor>(); // Store donor data
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [commentsInput, setCommentsInput] = useState(""); // Store comments input
  const [comments, setComments] = useState<string[]>([]); // Store comments
  const [searchQuery, setSearchQuery] = useState(""); // Store the search query
  const [filteredComments, setFilteredComments] = useState<string[]>([]); // Store filtered comments
  const [username, setUsername] = useState(""); // Toggle between basic and detailed view

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
  }, []);

  useEffect(() => {
    const name = decodeURIComponent(params.get("name")!);
    setFirstName(name.split(" ")[0]);
    setLastName(name.split(" ")[1]);
  }, [params]);

  useEffect(() => {
    fetchDonorData();
    fetchComments();
  }, [firstName, lastName]);

  useEffect(() => {
    handleSearchComments(searchQuery); // Filter comments whenever the search query changes
  }, [searchQuery, comments]);

  const fetchDonorData = async () => {
    setLoading(true);
    try {
      const donors = await GetDonors();
      const donor = donors.filter(
        (donor) =>
          donor.first_name === firstName && donor.last_name === lastName,
      )[0];
      setDonor(donor);
    } catch (error) {
      console.error("Error fetching donor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = () => {
    const lsComments = JSON.parse(localStorage.getItem("comments") || "{}");
    const donorComments = lsComments[`${firstName} ${lastName}`] || [];
    setComments(donorComments);
  };

  const handleSubmitComment = () => {
    const lsComments = JSON.parse(localStorage.getItem("comments") || "{}");
    const donorComments = lsComments[`${firstName} ${lastName}`] || [];
    const newComments = {
      ...lsComments,
      [`${firstName} ${lastName}`]: [...donorComments, commentsInput],
    };
    localStorage.setItem("comments", JSON.stringify(newComments));
    setCommentsInput("");
    fetchComments();
  };

  const handleSearchComments = (query: string) => {
    if (!query) {
      setFilteredComments(comments);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = comments.filter((comment) =>
        comment.toLowerCase().includes(lowerCaseQuery),
      );
      setFilteredComments(filtered);
    }
  };

  if (loading || !donor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="background flex justify-center mt-32 mx-auto w-3/4 max-w-2xl flex-col gap-8">
      <FontSizeAndTheme />
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

      <div className="flex gap-8">
        <div className="w-1/3">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>
                {donor.first_name} {donor.last_name}
              </CardTitle>
              <CardDescription>Donor Basic Information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <img
                  src={"/defaultDonorPhoto.png"}
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
          <Button
            className="mt-2 w-full"
            variant="outline"
            onClick={() => {
              window.location.href = "/fundraiser";
            }}
          >
            Back to Fundraiser Page
          </Button>
        </div>

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
              <input
                type="text"
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
              />
              <div className="space-y-2">
                {filteredComments.map((comment, index) => (
                  <div key={index} className="bg-gray-100 p-2 rounded-md">
                    {comment}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-none mt-8">
        <CardHeader>
          <CardTitle>Add a Comment</CardTitle>
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