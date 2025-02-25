import React, { useState } from 'react';
import { format } from 'date-fns';
import useSubmissions, { Submission } from '@/hooks/useSubmissons';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from '@/context/UserContext';

const ProfilePage: React.FC = () => {
  const {user } = useUser();
  const { submissions, loading, error } = useSubmissions();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'passed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <div className="container mx-auto py-8 pagePadding">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-2"><span className="font-semibold">Username:</span> {user?.username}</p>
          <p className="text-lg"><span className="font-semibold">Email:</span> {user?.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Challenge</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <TableCell>Challenge {submission.challenge}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(submission.submitted_at), 'PPp')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="mt-4">
              <p className="mb-2"><span className="font-semibold">Challenge:</span> {selectedSubmission.challenge}</p>
              <p className="mb-2"><span className="font-semibold">Status:</span> 
                <Badge className={`ml-2 ${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status}
                </Badge>
              </p>
              <p className="mb-2"><span className="font-semibold">Submitted at:</span> {format(new Date(selectedSubmission.submitted_at), 'PPp')}</p>
              <div className="mb-2">
                <p className="font-semibold mb-1">Code:</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{selectedSubmission.code}</code>
                </pre>
              </div>
              {selectedSubmission.result.results && (
                <div>
                  <p className="font-semibold mb-1">Test Results:</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Input</TableHead>
                        <TableHead>Expected Output</TableHead>
                        <TableHead>Actual Output</TableHead>
                        <TableHead>Passed</TableHead>
                        <TableHead>Execution Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSubmission.result.results.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell>{JSON.stringify(result.input)}</TableCell>
                          <TableCell>{JSON.stringify(result.expected_output)}</TableCell>
                          <TableCell>{JSON.stringify(result.actual_output)}</TableCell>
                          <TableCell>
                            <Badge className={result.passed ? 'bg-green-500' : 'bg-red-500'}>
                              {result.passed ? 'Yes' : 'No'}
                            </Badge>
                          </TableCell>
                          <TableCell>{result.execution_time.toFixed(4)}s</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {selectedSubmission.result.detail && (
                <p className="mt-2 text-red-500"><span className="font-semibold">Error:</span> {selectedSubmission.result.detail}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;