import { useState } from 'react'


interface IToolTipProps {
    text: string,
    children: JSX.Element
}

export default function ToolTip({ text , children}: IToolTipProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className='tooltip'
      >
        {children}
        {showTooltip && (
            <div
                className='tooltip-text'
            >
            {text}
            </div>
        )}
        </div>
    );
};