'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { UserRoundPlus, UserRoundMinus, House } from 'lucide-react'
import Link from 'next/link'
import { useGame } from '@/context/GameContext'
import { useRouter } from 'next/navigation'

export default function GamePage() {
    const [players, setPlayers] = useState([
        { name: 'Player 1' },
        { name: 'Player 2' },
    ])
    const [scores, setScores] = useState({})
    const [isGameStarted, setIsGameStarted] = useState(false)
    const [showHomeDialog, setShowHomeDialog] = useState(false)
    const [showResetDialog, setShowResetDialog] = useState(false)
    const [showEndDialog, setShowEndDialog] = useState(false)
    const { addGame } = useGame()
    const router = useRouter()

    useEffect(() => {
        const initialScores = {}
        for (let i = 3; i <= 13; i++) {
            initialScores[i] = Array(players.length).fill(0)
        }
        setScores(initialScores)
    }, [players.length])

    const handleAddPlayer = () => {
        const newPlayer = { name: `Player ${players.length + 1}` }
        setPlayers([...players, newPlayer])
    }

    const handleRemovePlayer = () => {
        if (players.length > 2) {
            setPlayers(players.slice(0, -1))
        }
    }

    const handlePlayerNameChange = (index, value) => {
        const updatedPlayers = [...players]
        updatedPlayers[index].name = value
        setPlayers(updatedPlayers)
    }

    const handleScoreChange = (hand, playerIndex, value) => {
        const newScore = Math.max(0, parseInt(value) || 0)
        setScores(prevScores => ({
            ...prevScores,
            [hand]: prevScores[hand].map((score, index) => (index === playerIndex ? newScore : score))
        }))
        setIsGameStarted(true)
    }

    const calculateTotal = (playerIndex) => {
        return Object.values(scores).reduce((total, handScores) => total + handScores[playerIndex], 0)
    }

    const determineWinner = () => {
        const totals = players.map((_, index) => calculateTotal(index))
        const winningScore = Math.min(...totals)
        return totals.indexOf(winningScore)
    }

    const handleGameEnd = async () => {
        const winnerIndex = determineWinner()
        const gameResult = {
            date: new Date().toISOString(),
            players: players.map((player, index) => ({ 
            ...player, 
            index,
            isWinner: index === winnerIndex,
            score: calculateTotal(index)
            })),
            scores: scores,
        }
        
        await addGame(gameResult)
        router.push('/history')
        }

    const resetGame = () => {
        const newScores = {}
        for (let i = 3; i <= 13; i++) {
            newScores[i] = Array(players.length).fill(0)
        }
        setScores(newScores)
        setIsGameStarted(false)
    }
  
    return (
        <Card className='w-full mx-auto'>
            <CardHeader>
                <CardTitle className='text-2xl font-bold text-center'>Current Game</CardTitle>
            </CardHeader>
            <CardContent className='px-3'>
                {/* todo - add skip to content and skip content to end nav */}
                <div className='flex items-center justify-center mb-4 space-x-4'>
                    <Button onClick={handleAddPlayer} className='flex items-center justify-center'>
                        <UserRoundPlus className='w-4 h-4 mr-0 sm:mr-2' />
                        <span className='hidden sm:block'>Add Player</span>
                    </Button>
                    <Button onClick={handleRemovePlayer} variant='outline' className='flex items-center justify-center' disabled={players.length <= 2}>
                        <UserRoundMinus className='w-4 h-4 mr-0 sm:mr-2' />
                        <span className='hidden sm:block'>Remove Player</span>
                    </Button>
                    <Dialog open={showHomeDialog} onOpenChange={setShowHomeDialog}>
                        <DialogTrigger asChild>
                            <Button variant='outline' className='flex items-center justify-center'>
                                <House className='w-4 h-4 mr-0 sm:mr-2' />
                                <span className='hidden sm:block'>Main Menu</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='w-11/12 rounded-md'>
                            <DialogHeader>
                                <DialogTitle>Return to Main Menu?</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to return to the main menu? Your current game progress will be lost.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant='outline' className='mt-3 sm:mt-0' onClick={() => setShowHomeDialog(false)}>Cancel</Button>
                                <Button className='w-full sm:w-auto' asChild>
                                    <Link href='/'>Confirm</Link>
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='p-1 sm:p-2'>Hand</TableHead>
                            {players.map((player, index) => (
                                <TableHead key={index} className='p-1 text-center sm:p-2'>
                                    <Label htmlFor={`player-${index}`} className='sr-only'>Player {index + 1} name</Label>
                                    <Input
                                        name={`player-${index}`}
                                        id={`player-${index}`}
                                        value={player.name}
                                        onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                                        className='p-1 text-center sm:p-2'
                                    />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.entries(scores).map(([hand, handScores]) => (
                            <TableRow key={hand}>
                                <TableCell className='p-1 font-medium sm:p-2'>{hand}</TableCell>
                                    {handScores.map((score, playerIndex) => (
                                        <TableCell key={playerIndex} className='p-1 sm:p-2'>
                                            {players[playerIndex] && (
                                            <>
                                            <Label htmlFor={`hand-${hand}-player-${playerIndex}`} className='sr-only'>Score for {players[playerIndex].name} on hand {hand}</Label>
                                            <Input
                                                name={`hand-${hand}-player-${playerIndex}`}
                                                id={`hand-${hand}-player-${playerIndex}`}
                                                type='number'
                                                value={score || ''}
                                                onChange={(e) => handleScoreChange(parseInt(hand), playerIndex, e.target.value)}
                                                className='w-full p-1 text-center sm:p-2'
                                                inputMode='numeric'
                                                min='0'
                                            />
                                            </>
                                            )}
                                        </TableCell>
                                    ))}
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell className='p-1 font-bold sm:p-2'>Total</TableCell>
                                {players.map((_, index) => (
                                    <TableCell key={index} className='p-1 font-bold text-center sm:p-2'>
                                        {calculateTotal(index)}
                                    </TableCell>
                                ))}
                        </TableRow>
                    </TableBody>
                </Table>
                <div className='flex justify-center mt-4 space-x-4'>
                    <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                        <DialogTrigger asChild>
                            <Button>Reset Game</Button>
                        </DialogTrigger>
                        <DialogContent className='w-11/12 rounded-md'>
                            <DialogHeader>
                                <DialogTitle>Reset Game?</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to reset the game? All current scores will be lost.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant='outline' className='mt-3 sm:mt-0' onClick={() => setShowResetDialog(false)}>Cancel</Button>
                                <Button className='w-full sm:w-auto' onClick={() => {
                                    resetGame()
                                    setShowResetDialog(false)
                                }}>Confirm</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                        <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
                        <DialogTrigger asChild>
                            <Button>Submit Game</Button>
                        </DialogTrigger>
                        <DialogContent className='w-11/12 rounded-md'>
                            <DialogHeader>
                                <DialogTitle>Submit Game?</DialogTitle>
                                <DialogDescription>
                                    This will save the current scores.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant='outline' className='mt-3 sm:mt-0' onClick={() => setShowEndDialog(false)}>Cancel</Button>
                                <Button className='w-full sm:w-auto' onClick={() => {
                                    handleGameEnd()
                                    setShowEndDialog(false)
                                }}>Confirm</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )
}