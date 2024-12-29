import { CgSpinner } from "react-icons/cg";
import './spinner.css';


type SpinnerProps = {
    isLoading: boolean;
    onStartClickedChange: (value: boolean) => void;
};

export const Spinner: React.FC<SpinnerProps> = (spinnerProps: SpinnerProps) => {

    const handleStartClick = () => {
        // we send event that start button has been clicked
        spinnerProps.onStartClickedChange(true);  
      };

    return (
        <div className="spinner-container">
                {
                    spinnerProps.isLoading
                    &&
                    <div className="spinner-content">
                        <span>Loading of the Optimus World Experience</span>
                        <CgSpinner className="rotating spinner" />
                    </div>
                }
                {
                    !spinnerProps.isLoading
                    &&
                    <button onClick={handleStartClick} >Start The experience 🚀</button>
                }
        </div>
    )
}