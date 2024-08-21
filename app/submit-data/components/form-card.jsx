'use client';

import { useState } from 'react';

const FormCard = () => {
  const [rateMyProfessorLink, setRateMyProfessorLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // submit form
  };

  return (
    <div className="rounded-lg shadow-lg p-4 w-[95%] md:w-[450px] border">
      <div>
        <h1 className="text-center text-2xl font-bold">
          Submit New Professor Data
        </h1>
        <h3 className="text-center text-muted-foreground mb-6 text-sm">
          Submit a link to a Rate My Professor page
        </h3>
      </div>
      <div className="grid gap-4">
        <div>
          <label htmlFor="rateMyProfessorLink" className="block">
            Rate My Professor Link
          </label>
          <input
            type="text"
            id="rateMyProfessorLink"
            value={rateMyProfessorLink}
            onChange={(e) => setRateMyProfessorLink(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-yellow-400 px-3 py-2 rounded-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default FormCard;
