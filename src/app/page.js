'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Trophy, Play, History, Info } from 'lucide-react'
import Link from 'next/link'
import { useGame } from '../context/GameContext'

export default function IndexPage() {
    const { players, games, isLoading } = useGame()

    const topPlayers = players.slice(0, 5)
    const highestScore = players.reduce((max, player) => (player.highest_score > max.highest_score ? player : max), { highest_score: 0 })
    const lowestScore = players.reduce((min, player) => {
        if (min.lowest_score === undefined || player.lowest_score < min.lowest_score) {
            return player;
        }
        return min;
    }, { lowest_score: undefined })
    const totalGames = games.length
    const { totalScore, totalPlayers } = games.reduce((acc, game) => {
        game.players.forEach(player => {
            acc.totalScore += player.score
            acc.totalPlayers++
        })
        return acc
    }, { totalScore: 0, totalPlayers: 0 })
    const avgScore = totalPlayers > 0 ? totalScore / totalPlayers : 0

    return (
        <>
            <h1 className='mb-8 text-3xl font-bold text-center'>Thirteen Score Tracker</h1>
            <div className='flex justify-center mb-4 space-x-4'>
                <Button asChild>
                    <Link href='/game'>
                        <Play className='w-4 h-4 mr-2' />
                        <span>New Game</span>
                    </Link>
                </Button>
                <Button variant='outline' asChild>
                    <Link href='/history'>
                        <History className='w-4 h-4 mr-2' />
                        <span>Game History</span>
                    </Link>
                </Button>
            </div>

            <Card className='mt-8'>
                <CardHeader className='items-center'>
                    <div className='flex items-center'>
                        <Trophy className='w-5 h-5 mr-2' />
                        <h2 className='text-2xl font-semibold leading-none tracking-tight'>Leaderboard</h2>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-1/2'>Player</TableHead>
                                <TableHead className='w-1/2'>Wins</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading
                                ? Array(5).fill(0).map((_, index) => (
                                    <TableRow key={index}>
                                    <TableCell><Skeleton className='h-4 w-[100px]' /></TableCell>
                                    <TableCell><Skeleton className='h-4 w-[50px]' /></TableCell>
                                    </TableRow>
                                ))
                                : topPlayers.map((player, index) => (
                                    <TableRow key={`${player.name}-${index}`}>
                                    <TableCell>{player.name}</TableCell>
                                    <TableCell>{player.wins}</TableCell>
                                    </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className='mt-4 space-y-2 text-center'>
                            {isLoading ? (
                            <>
                                <Skeleton className='h-4 w-[200px] mx-auto' />
                                <Skeleton className='h-4 w-[200px] mx-auto' />
                                <Skeleton className='h-4 w-[200px] mx-auto' />
                                <Skeleton className='h-4 w-[200px] mx-auto' />
                                <Skeleton className='h-4 w-[200px] mx-auto' />
                                <Skeleton className='h-4 w-[200px] mx-auto' />
                                <Skeleton className='h-4 w-[200px] mx-auto' />
                            </>
                        ) : (
                            <>
                                <div className='flex items-center justify-center'>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant='link' className='h-auto p-0.5'>
                                                <Info className='inline w-4 h-4 mr-1' />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align='start' className='text-center text-balance'>
                                            <p>The highest score achieved by any player in a single game</p>
                                        </PopoverContent>
                                    </Popover>
                                    <p><strong>Highest Score:</strong> {highestScore.highest_score !== 0 ? `${highestScore.highest_score} - ${highestScore.name}` : 'N/A'}</p>
                                </div>
                                <div className='flex items-center justify-center'>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant='link' className='h-auto p-0.5'>
                                                <Info className='inline w-4 h-4 mr-1' />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align='start' className='text-center text-balance'>
                                            <p>The lowest score achieved by any player in a single game</p>
                                        </PopoverContent>
                                    </Popover>
                                    <p><strong>Lowest Score:</strong> {lowestScore.lowest_score !== undefined ? `${lowestScore.lowest_score} - ${lowestScore.name}` : 'N/A'}</p>
                                </div>
                                <div className='flex items-center justify-center'>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant='link' className='h-auto p-0.5'>
                                                <Info className='inline w-4 h-4 mr-1' />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align='start' className='text-center text-balance'>
                                            <p>The average score across all games and players</p>
                                        </PopoverContent>
                                    </Popover>
                                    <p><strong>Average Score:</strong> {avgScore.toFixed(2)}</p>
                                </div>
                                <div className='flex items-center justify-center'>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant='link' className='h-auto p-0.5'>
                                                <Info className='inline w-4 h-4 mr-1' />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align='start' className='text-center text-balance'>
                                            <p>The total number of games played</p>
                                        </PopoverContent>
                                    </Popover>
                                    <p><strong>Total Games:</strong> {totalGames}</p>
                                </div>
                          </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}