'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trophy, Play, History } from 'lucide-react'
import Link from 'next/link'
import { useGame } from '../context/GameContext'

export default function IndexPage() {
    const { players } = useGame()

    const topPlayers = players.slice(0, 5)
    const highestScore = players.reduce((max, player) => (player.highest_score > max.highest_score ? player : max), { highest_score: 0 })
    const lowestScore = players.reduce((min, player) => (player.lowest_score < min.lowest_score || min.lowest_score === 0 ? player : min), { lowest_score: Infinity })

    return (
    <>
        <h1 className='mb-8 text-3xl font-bold text-center'>Thirteen Score Tracker</h1>
        
        <div className='flex justify-center mb-8 space-x-4'>
        <Link href='/game'>
            <Button>
            <Play className='w-4 h-4 mr-2' /> New Game
            </Button>
        </Link>
        <Link href='/history'>
            <Button variant='outline'>
            <History className='w-4 h-4 mr-2' /> Game History
            </Button>
        </Link>
        </div>

        <Card className='mt-8'>
        <CardHeader>
            <CardTitle className='flex items-center'>
            <Trophy className='w-5 h-5 mr-2' />
            Scoreboard
            </CardTitle>
        </CardHeader>
        <CardContent>
            <h2 className='mb-2 font-semibold'>Top 5 Players</h2>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Wins</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {topPlayers.map((player, index) => (
                <TableRow key={`${player.name}-${index}`}>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.wins}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
            <div className='mt-4'>
            <p><strong>Highest Score:</strong> {highestScore.highest_score} - {highestScore.name}</p>
            <p><strong>Lowest Score:</strong> {lowestScore.lowest_score} - {lowestScore.name}</p>
            </div>
        </CardContent>
        </Card>
    </>
    )
}