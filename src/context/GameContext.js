'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '../utils/supabase/client'

const GameContext = createContext()

export function GameProvider({ children }) {
    const [games, setGames] = useState([])
    const [players, setPlayers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
    fetchGames()
    fetchPlayers()
    }, [])

    async function fetchGames() {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .order('created_at', { ascending: false })
        if (error) {
            console.error('Error fetching games:', error)
        } else {
            setGames(data)
            setIsLoading(false)
        }
    }

    async function fetchPlayers() {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('players')
            .select('*')
            .order('wins', { ascending: false })
        if (error) {
            console.error('Error fetching players:', error)
        } else {
            setPlayers(data)
            setIsLoading(false)
        }
    }

    async function addGame(gameData) {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('games')
            .insert(gameData)
            .select()
        if (error) {
            console.error('Error adding game:', error)
        } else {
            setGames([data[0], ...games])
            updatePlayerStats(gameData)
            setIsLoading(false)
        }
    }

    async function updatePlayerStats(gameData) {
        setIsLoading(true)
        for (let playerData of gameData.players) {
            // First, try to find an existing player with this name
            let { data: existingPlayers, error: fetchError } = await supabase
                .from('players')
                .select('*')
                .eq('name', playerData.name)
            if (fetchError) {
                console.error('Error fetching player:', fetchError)
            continue
            }

            if (existingPlayers.length > 0) {
            // If player exists, update their stats
            const player = existingPlayers[0]
            const { error: updateError } = await supabase
                .from('players')
                .update({
                wins: player.wins + (playerData.isWinner ? 1 : 0),
                games_played: player.games_played + 1,
                highest_score: Math.max(player.highest_score, playerData.score),
                lowest_score: player.lowest_score === 0 ? playerData.score : Math.min(player.lowest_score, playerData.score)
                })
                .eq('id', player.id)

                if (updateError) console.error('Error updating player stats:', updateError)
            } else {
            // If player doesn't exist, create a new record
            const { error: insertError } = await supabase
                .from('players')
                .insert({
                    name: playerData.name,
                    wins: playerData.isWinner ? 1 : 0,
                    games_played: 1,
                    highest_score: playerData.score,
                    lowest_score: playerData.score
                })

                if (insertError) console.error('Error inserting new player:', insertError)
            }
        }

        fetchPlayers()
        setIsLoading(false)
    }

    return (
    <GameContext.Provider value={{ games, players, isLoading, addGame }}>
        {children}
    </GameContext.Provider>
    )
}

export function useGame() {
    return useContext(GameContext)
}