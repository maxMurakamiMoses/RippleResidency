// ElectionDashboard.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Info, Loader2, Users, Building2, Edit3 } from 'lucide-react';

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

  // State for editing Parties
  const [editingPartyId, setEditingPartyId] = useState<number | null>(null);
  const [partyForm, setPartyForm] = useState({
    id: 0,
    title: '',
    description: '',
    emoji: '',
    ctaText: '',
    ctaLink: '',
    content: '',
  });

  // State for editing Candidates
  const [editingCandidateId, setEditingCandidateId] = useState<number | null>(null);
// Add new fields to candidateForm state
const [candidateForm, setCandidateForm] = useState({
    id: 0,
    presidentId: 0,
    vicePresidentId: 0,
    presidentName: '',
    presidentAge: 0,
    presidentSex: '',
    vicePresidentName: '',
    vicePresidentAge: 0,
    vicePresidentSex: '',
  });
  

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Helper function to get politician details by ID
  const getPolitician = (id: number) => {
    return data?.politicians.find((p) => p.id === id);
  };

  // Handlers for editing Parties

  // Handler to open edit form for a party
  const handleEditPartyClick = (partyId: number) => {
    if (data) {
      const party = data.parties.find((p) => p.id === partyId);
      if (party) {
        setPartyForm(party);
        setEditingPartyId(partyId);
      }
    }
  };

  // Handler to close edit form for a party
  const handleCancelPartyEdit = () => {
    setEditingPartyId(null);
    setPartyForm({
      id: 0,
      title: '',
      description: '',
      emoji: '',
      ctaText: '',
      ctaLink: '',
      content: '',
    });
  };

  // Handler for party form input changes
  const handlePartyInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPartyForm({
      ...partyForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handler for party form submission
  const handlePartyFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const response = await fetch('/api/updateCandidate', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(candidateForm),
        });
    
        const result = await response.json();
    
        if (!result.success) {
          throw new Error(result.detail || 'Failed to update candidate');
        }
    
        // Update local state with the updated candidate and politicians data
        if (data) {
          const updatedCandidates = data.candidates.map((candidate) =>
            candidate.id === candidateForm.id ? result.data.candidate : candidate
          );
    
          const updatedPoliticians = data.politicians.map((politician) => {
            if (politician.id === result.data.president.id) {
              return result.data.president;
            } else if (politician.id === result.data.vicePresident.id) {
              return result.data.vicePresident;
            } else {
              return politician;
            }
          });
    
          setData({
            ...data,
            candidates: updatedCandidates,
            politicians: updatedPoliticians,
          });
        }
    
        // Close the edit form
        handleCancelCandidateEdit();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsSubmitting(false);
      }
    };
  // Handlers for editing Candidates

  // Handler to open edit form for a candidate
  const handleEditCandidateClick = (candidateId: number) => {
    if (data) {
      const candidate = data.candidates.find((c) => c.id === candidateId);
      if (candidate) {
        const president = getPolitician(candidate.presidentId);
        const vicePresident = getPolitician(candidate.vicePresidentId);
  
        setCandidateForm({
          id: candidate.id,
          presidentId: candidate.presidentId,
          vicePresidentId: candidate.vicePresidentId,
          presidentName: president?.name || '',
          presidentAge: president?.age || 0,
          presidentSex: president?.sex || '',
          vicePresidentName: vicePresident?.name || '',
          vicePresidentAge: vicePresident?.age || 0,
          vicePresidentSex: vicePresident?.sex || '',
        });
        setEditingCandidateId(candidateId);
      }
    }
  };
  

  // Handler to close edit form for a candidate
  const handleCancelCandidateEdit = () => {
    setEditingCandidateId(null);
    setCandidateForm({
      id: 0,
      presidentId: 0,
      vicePresidentId: 0,
    });
  };

  // Handler for candidate form submission
  const handleCandidateFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await fetch('/api/updateCandidate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidateForm),
      });
  
      const result = await response.json();
  
      if (!result.success) {
        throw new Error(result.detail || 'Failed to update candidate');
      }
  
      // Update local state with the updated candidate and politicians data
      if (data) {
        const updatedCandidates = data.candidates.map((candidate) =>
          candidate.id === candidateForm.id ? result.data.candidate : candidate
        );
  
        const updatedPoliticians = data.politicians.map((politician) => {
          if (politician.id === result.data.president.id) {
            return result.data.president;
          } else if (politician.id === result.data.vicePresident.id) {
            return result.data.vicePresident;
          } else {
            return politician;
          }
        });
  
        setData({
          ...data,
          candidates: updatedCandidates,
          politicians: updatedPoliticians,
        });
      }
  
      // Close the edit form
      handleCancelCandidateEdit();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  

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
            {/* Election Statistics */}
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
                    <span className="text-xl font-semibold">
                      {data.candidates.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Total Parties</span>
                    <span className="text-xl font-semibold">{data.parties.length}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Total Politicians</span>
                    <span className="text-xl font-semibold">
                      {data.politicians.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.parties.map((party) => (
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
<CardHeader className="bg-gray-50 flex flex-row justify-between items-center w-full flex-nowrap">
  <span className="text-lg font-medium">
    Candidate Pair #{candidate.id}
  </span>
  <button
    onClick={() => handleEditCandidateClick(candidate.id)}
    className="inline-flex items-center px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
  >
    <Edit3 className="w-4 h-4 mr-1" />
    Edit
  </button>
</CardHeader>



                  <CardContent className="mt-4">
                  {editingCandidateId === candidate.id ? (
  // Edit Form for Candidate
  <form onSubmit={handleCandidateFormSubmit}>
    <div className="space-y-4">
      {/* Presidential Candidate */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-3">
          Presidential Candidate
        </h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="presidentName"
              value={candidateForm.presidentName}
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  presidentName: e.target.value,
                })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Age</label>
            <input
              type="number"
              name="presidentAge"
              value={candidateForm.presidentAge}
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  presidentAge: Number(e.target.value),
                })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Sex</label>
            <input
              type="text"
              name="presidentSex"
              value={candidateForm.presidentSex}
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  presidentSex: e.target.value,
                })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
        </div>
      </div>
      {/* Vice Presidential Candidate */}
      <div className="p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-3">
          Vice Presidential Candidate
        </h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="vicePresidentName"
              value={candidateForm.vicePresidentName}
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  vicePresidentName: e.target.value,
                })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Age</label>
            <input
              type="number"
              name="vicePresidentAge"
              value={candidateForm.vicePresidentAge}
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  vicePresidentAge: Number(e.target.value),
                })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Sex</label>
            <input
              type="text"
              name="vicePresidentSex"
              value={candidateForm.vicePresidentSex}
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  vicePresidentSex: e.target.value,
                })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
        </div>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-end space-x-2">
      <button
        type="button"
        onClick={handleCancelCandidateEdit}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </div>
  </form>
                    ) : (
                      // Display Candidate Details
                      <div className="space-y-6">
                        {/* President Details */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h3 className="font-semibold text-lg mb-3">
                            Presidential Candidate
                          </h3>
                          <div className="space-y-2">
                            <p className="font-medium">{president?.name}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <p>
                                <span className="text-gray-600">Age:</span> {president?.age}
                              </p>
                              <p>
                                <span className="text-gray-600">Sex:</span> {president?.sex}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Vice President Details */}
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h3 className="font-semibold text-lg mb-3">
                            Vice Presidential Candidate
                          </h3>
                          <div className="space-y-2">
                            <p className="font-medium">{vicePresident?.name}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <p>
                                <span className="text-gray-600">Age:</span> {vicePresident?.age}
                              </p>
                              <p>
                                <span className="text-gray-600">Sex:</span> {vicePresident?.sex}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
                  {editingPartyId === party.id ? (
                    // Edit Form for Party
                    <form onSubmit={handlePartyFormSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium">Title</label>
                          <input
                            type="text"
                            name="title"
                            value={partyForm.title}
                            onChange={handlePartyInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={partyForm.description}
                            onChange={handlePartyInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Emoji</label>
                          <input
                            type="text"
                            name="emoji"
                            value={partyForm.emoji}
                            onChange={handlePartyInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">CTA Text</label>
                          <input
                            type="text"
                            name="ctaText"
                            value={partyForm.ctaText}
                            onChange={handlePartyInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">CTA Link</label>
                          <input
                            type="url"
                            name="ctaLink"
                            value={partyForm.ctaLink}
                            onChange={handlePartyInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Content</label>
                          <textarea
                            name="content"
                            value={partyForm.content}
                            onChange={handlePartyInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={handleCancelPartyEdit}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Display Party Details
                    <>
                      <p className="mb-4">{party.description}</p>
                      <p className="text-sm text-gray-600">{party.content}</p>
                      <a
                        href={party.ctaLink}
                        className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        {party.ctaText}
                      </a>
                      <button
                        onClick={() => handleEditPartyClick(party.id)}
                        className="mt-4 ml-2 inline-flex items-center px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </>
                  )}
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
