'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { House } from 'lucide-react'
import Link from 'next/link'
import { useGame } from '@/context/GameContext'

export default function HistoryPage() {
  const { games } = useGame()

  const calculateTotal = (scores, playerIndex) => {
    return Object.values(scores).reduce((total, handScores) => total + handScores[playerIndex], 0)
  }

  return (
    <div className='container p-4 mx-auto'>
        <h1 className='mb-8 text-3xl font-bold text-center'>Game History</h1>
        <div className='flex justify-center mb-4'>
            <Link href='/'>
            <Button variant='outline'>
                <House className='w-4 h-4 mr-2' /> Main Menu
            </Button>
            </Link>
        </div>
        {games.map((game) => (
            <Card key={game.id} className='mb-4'>
            <CardHeader>
                <CardTitle className='text-lg'>{new Date(game.date).toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {game.players.map((player, index) => (
                    <TableRow key={`${player.name}-${index}`}>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{calculateTotal(game.scores, index)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
        ))}
    </div>
  )
}