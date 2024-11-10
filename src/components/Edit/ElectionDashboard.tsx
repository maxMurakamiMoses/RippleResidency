"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Info, Loader2, Users, Building2 } from 'lucide-react';

interface ElectionData {
  electionInfo: {
    id: number;
    title: string;
    description: string;
  };
  parties: {
    id: number;
    title: string;
    description: string;
    emoji: string;
    ctaText: string;
    ctaLink: string;
    content: string;
  }[];
  politicians: {
    id: number;
    name: string;
    age: number;
    sex: string;
  }[];
  candidates: {
    id: number;
    presidentId: number;
    vicePresidentId: number;
  }[];
}

const ElectionDashboard = () => {
  const [data, setData] = useState<ElectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/fetchElectionData');
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.detail || 'Failed to fetch election data');
        }
        
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-500 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Helper function to get politician details by ID
  const getPolitician = (id: number) => {
    return data.politicians.find(p => p.id === id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Election Info Header */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-6 h-6" />
            {data.electionInfo?.title || 'Upcoming Election'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{data.electionInfo?.description}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="parties">Parties</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Election Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Total Candidate Pairs</span>
                    <span className="text-xl font-semibold">{data.candidates.length}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Total Parties</span>
                    <span className="text-xl font-semibold">{data.parties.length}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Total Politicians</span>
                    <span className="text-xl font-semibold">{data.politicians.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.parties.map(party => (
                    <div key={party.id} className="flex items-center gap-2">
                      <span>{party.emoji}</span>
                      <a 
                        href={party.ctaLink} 
                        className="text-blue-500 hover:underline"
                      >
                        {party.title}
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="candidates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.candidates.map((candidate) => {
              const president = getPolitician(candidate.presidentId);
              const vicePresident = getPolitician(candidate.vicePresidentId);
              
              return (
                <Card key={candidate.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <CardTitle>Candidate Pair #{candidate.id}</CardTitle>
                  </CardHeader>
                  <CardContent className="mt-4">
                    <div className="space-y-6">
                      {/* President Details */}
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">Presidential Candidate</h3>
                        <div className="space-y-2">
                          <p className="font-medium">{president?.name}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <p><span className="text-gray-600">Age:</span> {president?.age}</p>
                            <p><span className="text-gray-600">Sex:</span> {president?.sex}</p>
                          </div>
                        </div>
                      </div>

                      {/* Vice President Details */}
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">Vice Presidential Candidate</h3>
                        <div className="space-y-2">
                          <p className="font-medium">{vicePresident?.name}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <p><span className="text-gray-600">Age:</span> {vicePresident?.age}</p>
                            <p><span className="text-gray-600">Sex:</span> {vicePresident?.sex}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="parties">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.parties.map((party) => (
              <Card key={party.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{party.emoji}</span>
                    {party.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{party.description}</p>
                  <p className="text-sm text-gray-600">{party.content}</p>
                  <a 
                    href={party.ctaLink}
                    className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    {party.ctaText}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElectionDashboard;