import useChallenges from '@/hooks/useChallenges';
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { useNavigate } from 'react-router';
import LoadingAnimation from '../Loading';
import {motion }   from 'framer-motion'

const ChallengesSection: React.FC = () => {
  const navigate = useNavigate();
    const { loading, Challenges, error } = useChallenges();

    if (loading) return <LoadingAnimation/>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 ,delay:1 }}
        >
            <h1 className='text-3xl font-semibold border-b py-3'>Challenges</h1>
            <div>
            <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Title</TableHead>
            <TableHead className='text-right'>Difficulty</TableHead>
            <TableHead className='text-right w-28'>Category</TableHead>
            <TableHead className="text-right w-28">Points</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Challenges && Challenges.map((challenge) => (
            <TableRow key={challenge.id}
            onClick={() => navigate(`/challenges/${challenge.id}`)}
            >
              <TableCell className="font-medium">{challenge.title}</TableCell>
              
              <TableCell className={`
                                capitalize text-right ${challenge.difficulty === 'beginner' ? 'text-green-500' : 
                                   challenge.difficulty === 'Intermediate' ? 'text-orange-500' : 
                                   'text-red-500'}
                                   `}>{challenge.difficulty}</TableCell>
              
              <TableCell className="text-right capitalize">{challenge.category}</TableCell>
              <TableCell className="text-right">{challenge.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>

                
            </div>
        </motion.div>
    );
};

export default ChallengesSection;
