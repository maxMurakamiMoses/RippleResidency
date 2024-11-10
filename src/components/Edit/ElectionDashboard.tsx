'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Award, Vote, Info } from 'lucide-react';

const ElectionDashboard = () => {
  const [data, setData] = useState({
    parties: [],
    politicians: [],
    candidates: [],
    electionInfo: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const response = await fetch('/api/fetchElectionData');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch election data:', err);
        setError(err.message || 'An unknown error occurred.');
        setLoading(false);
      }
    };

    fetchElectionData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  const { parties, politicians, candidates, electionInfo } = data;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Election Dashboard</h1>
        {electionInfo.map((info) => (
          <div key={info.id} className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{info.title}</h2>
            <p className="text-gray-600">{info.description}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="parties" className="w-full">
        {/* Updated TabsList */}
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="parties" className="flex items-center justify-center gap-2">
            <Vote className="h-4 w-4" />
            Parties
          </TabsTrigger>
          <TabsTrigger value="candidates" className="flex items-center justify-center gap-2">
            <Award className="h-4 w-4" />
            Candidates
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center justify-center gap-2">
            <Info className="h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        {/* Parties Tab */}
        <TabsContent value="parties" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parties.map((party) => (
              <Card key={party.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{party.emoji}</span>
                    {party.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{party.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm">Members: {party.politicians.length}</p>
                    <a
                      href={party.ctaLink}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      {party.ctaText}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Candidates Tab */}
        <TabsContent value="candidates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <Card key={candidate.id}>
                <CardHeader>
                  <CardTitle>Presidential Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded">
                      <h3 className="font-semibold mb-2">President Candidate</h3>
                      <p>Name: {candidate.president.name}</p>
                      <p>Party: {candidate.president.party.title}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded">
                      <h3 className="font-semibold mb-2">Vice President Candidate</h3>
                      <p>Name: {candidate.vicePresident.name}</p>
                      <p>Party: {candidate.vicePresident.party.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Parties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{parties.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Politicians</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{politicians.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Presidential Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{candidates.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Age</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {politicians.length
                    ? Math.round(
                        politicians.reduce((acc, pol) => acc + pol.age, 0) / politicians.length
                      )
                    : 0}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElectionDashboard;
