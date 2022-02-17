import React from 'react';
import './WhiteListTag.css';

const getShortedWalletId = (walletId) => {
    if (walletId.length >= 10) {
        return walletId.slice(0, 3) + '...' + walletId.slice(walletId.length - 3, walletId.length)
    }

    return walletId
}

export const WhiteListTag = ({ walletId, handleRemove }) => {

    if (!walletId) return null;

    return (
        <div className="whiteListTag">
            {getShortedWalletId(walletId)}
            <span role="button" className='whiteListTagClose' onClick={() => handleRemove(walletId)} />
        </div>
    )
} 