import React, { useState } from 'react';
import { db } from './utils/firebase';
import { useParams } from "react-router-dom";
import { onValue, ref } from "firebase/database";

const Leaderboard = () => {
    const {username} = useParams();
    const [scoreData, setScoreData] = useState<any>(null)

    const dbRef = ref(db, `scores/${username || ''}`)
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (!scoreData) {
            setScoreData(data)
        }
      }, {onlyOnce: true})

    return (
        <div>
            <h1>{username ? 'Stats' : 'Leaderboard'}</h1>
            {scoreData && <div className="score">{Object.keys(scoreData).map(key => (
                <span key={key}>{key}: {JSON.stringify(scoreData[key])}</span>
            ))}</div>}
        </div>
    )
}

export default Leaderboard;