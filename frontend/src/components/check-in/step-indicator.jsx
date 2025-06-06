import { Check } from "lucide-react";

export function StepIndicator({ currentStep, steps }) {
    return (
        <div
            className="flex items-center justify-center w-full max-w-4xl mx-auto mb-8"
        >
            {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                    <div className="flex flex-col items-center">
                        {/* Icon */}
                        <div
                            className={
                                `w-12 h-12 rounded-full border-2 flex items-center justify-center
                                ${index < currentStep
                                    ? "bg-orange border-orange text-white"
                                    : index === currentStep
                                        ? "border-orange text-orange"
                                        : "border-zinc-200 text-zinc-300"
                                }`}
                        >
                            {
                                index < currentStep
                                    ? (<Check className="h-6 w-6" />)
                                    : (
                                        <span className="text-lg">
                                            {index + 1}
                                        </span>
                                    )
                            }
                        </div>

                        {/* Explain */}
                        <div className="text-sm mt-2 text-center">
                            <div className={index <= currentStep ? "text-orange font-medium" : "text-zinc-400"}>
                                {step.title}
                            </div>
                            <div className="text-zinc-400 text-xs">
                                {step.description}
                            </div>
                        </div>
                    </div>
                    
                    {/* stride */}
                    {index < steps.length - 1 && (
                        <div
                            className={`h-0.5 w-24 mx-4 ${index < currentStep ? "bg-orange" : "bg-zinc-300"}`}
                        />
                    )}

                </div>
            ))}
        </div>
    )
}