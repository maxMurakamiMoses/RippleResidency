import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DBVoteResults from './DBVoteResults';
import LedgerVoteResults from './LedgerVoteResults';

const VoteResultsToggle = () => {
  return (
    <Tabs defaultValue="db" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger 
          value="db"
          className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          DB Vote Results
        </TabsTrigger>
        <TabsTrigger 
          value="ledger"
          className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          Ledger Vote Results
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="db" className="mt-0">
        <DBVoteResults />
      </TabsContent>
      
      <TabsContent value="ledger" className="mt-0">
        <LedgerVoteResults />
      </TabsContent>
    </Tabs>
  );
};

export default VoteResultsToggle;