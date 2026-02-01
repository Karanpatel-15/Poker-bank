import { useState, useMemo } from 'react'
import { Plus, Trash2, AlertTriangle, RotateCcw } from 'lucide-react'

function PokerBank() {
  const [bankCash, setBankCash] = useState(0)
  const [players, setPlayers] = useState([])
  const [nextPlayerId, setNextPlayerId] = useState(1)

  // Calculated values
  const totalOwed = useMemo(() => {
    return players.reduce((sum, player) => sum + (parseFloat(player.rawCount) || 0), 0)
  }, [players])

  const difference = useMemo(() => {
    return (parseFloat(bankCash) || 0) - totalOwed
  }, [bankCash, totalOwed])

  const hasDiscrepancy = useMemo(() => {
    return Math.abs(difference) > 0.01 // Account for floating point precision
  }, [difference])

  // Functions
  const addPlayer = () => {
    const newPlayer = {
      id: nextPlayerId,
      name: '',
      rawCount: 0,
      adjustment: 0,
      finalPayout: 0
    }
    setPlayers([...players, newPlayer])
    setNextPlayerId(nextPlayerId + 1)
  }

  const removePlayer = (id) => {
    setPlayers(players.filter(player => player.id !== id))
  }

  const updatePlayer = (id, field, value) => {
    setPlayers(players.map(player => {
      if (player.id === id) {
        const updated = { ...player, [field]: value }
        // If rawCount changes, clear adjustments so user can re-apply them
        if (field === 'rawCount') {
          updated.rawCount = parseFloat(value) || 0
          updated.adjustment = 0
          updated.finalPayout = updated.rawCount
        }
        return updated
      }
      return player
    }))
  }

  const splitEqually = () => {
    if (players.length === 0) return
    const adjustmentPerPlayer = difference / players.length
    setPlayers(players.map(player => ({
      ...player,
      adjustment: adjustmentPerPlayer,
      finalPayout: (parseFloat(player.rawCount) || 0) + adjustmentPerPlayer
    })))
  }

  const splitProportionally = () => {
    if (players.length === 0 || totalOwed === 0) return
    setPlayers(players.map(player => {
      const rawCount = parseFloat(player.rawCount) || 0
      const adjustment = difference * (rawCount / totalOwed)
      return {
        ...player,
        adjustment: adjustment,
        finalPayout: rawCount + adjustment
      }
    }))
  }

  const clearSession = () => {
    setBankCash(0)
    setPlayers([])
    setNextPlayerId(1)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Poker Bank Reconciliation</h1>
          <button
            onClick={clearSession}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors min-h-[48px]"
          >
            <RotateCcw size={20} />
            <span className="hidden sm:inline">Clear Session</span>
          </button>
        </div>

        {/* Bank Input Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Total Physical Cash ($)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={bankCash || ''}
            onChange={(e) => setBankCash(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
            placeholder="0.00"
            step="0.01"
          />
        </div>

        {/* Players Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Players</h2>
            <button
              onClick={addPlayer}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors min-h-[48px]"
            >
              <Plus size={20} />
              <span>Add Player</span>
            </button>
          </div>

          <div className="space-y-3">
            {players.map((player) => (
              <div key={player.id} className="flex gap-2 items-center bg-gray-800 p-3 rounded-lg">
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                  placeholder="Player Name"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                />
                <input
                  type="number"
                  inputMode="decimal"
                  value={player.rawCount || ''}
                  onChange={(e) => updatePlayer(player.id, 'rawCount', e.target.value)}
                  placeholder="Chips"
                  className="w-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  step="0.01"
                />
                <button
                  onClick={() => removePlayer(player.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Remove player"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {players.length === 0 && (
              <p className="text-gray-400 text-center py-4">No players added yet. Click "Add Player" to get started.</p>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="mb-6 bg-gray-800 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Owed</div>
              <div className="text-xl font-semibold">{formatCurrency(totalOwed)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Difference</div>
              <div className={`text-xl font-semibold ${difference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(difference)}
              </div>
            </div>
          </div>

          {hasDiscrepancy && (
            <div className="flex items-center gap-2 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
              <AlertTriangle className="text-yellow-400" size={20} />
              <span className="text-yellow-400 font-medium">Discrepancy Detected</span>
            </div>
          )}
        </div>

        {/* Adjustment Buttons */}
        {hasDiscrepancy && players.length > 0 && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={splitEqually}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium min-h-[48px]"
            >
              Split Equally
            </button>
            <button
              onClick={splitProportionally}
              className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium min-h-[48px]"
            >
              Split Proportionally
            </button>
          </div>
        )}

        {/* Results Table */}
        {players.length > 0 && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Player</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Raw Count</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Adjustment</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Final Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {players.map((player) => (
                    <tr key={player.id} className="hover:bg-gray-750">
                      <td className="px-4 py-3 font-medium">{player.name || 'Unnamed'}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(parseFloat(player.rawCount) || 0)}</td>
                      <td className={`px-4 py-3 text-right font-medium ${(player.adjustment || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {formatCurrency(player.adjustment || 0)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-lg">
                        {formatCurrency(player.finalPayout || (parseFloat(player.rawCount) || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-700">
                  <tr>
                    <td className="px-4 py-3 font-bold">Total</td>
                    <td className="px-4 py-3 text-right font-bold">{formatCurrency(totalOwed)}</td>
                    <td className="px-4 py-3 text-right font-bold">{formatCurrency(
                      players.reduce((sum, p) => sum + (p.adjustment || 0), 0)
                    )}</td>
                    <td className="px-4 py-3 text-right font-bold text-lg">{formatCurrency(
                      players.reduce((sum, p) => sum + (p.finalPayout || (parseFloat(p.rawCount) || 0)), 0)
                    )}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PokerBank

