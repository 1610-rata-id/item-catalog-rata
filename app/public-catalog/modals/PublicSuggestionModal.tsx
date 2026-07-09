"use client";

import React from "react";

interface PublicSuggestionModalProps {
  theme: "light" | "dark";

  showSuggestion: boolean;

  setShowSuggestion: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  suggestionCategory: string;

  setSuggestionCategory: React.Dispatch<
    React.SetStateAction<string>
  >;

  suggestionMessage: string;

  setSuggestionMessage: React.Dispatch<
    React.SetStateAction<string>
  >;

  sendingSuggestion: boolean;

  senderName: string;

  setSenderName: React.Dispatch<
    React.SetStateAction<string>
  >;

  senderEmail: string;

  setSenderEmail: React.Dispatch<
    React.SetStateAction<string>
  >;

  division: string;

  setDivision: React.Dispatch<
    React.SetStateAction<string>
  >;

  office: string;

  setOffice: React.Dispatch<
    React.SetStateAction<string>
  >;

  submitSuggestion: () => void;
}

export default function PublicSuggestionModal(
  props: PublicSuggestionModalProps
) {
  const {
    theme,

    showSuggestion,
    setShowSuggestion,

    suggestionCategory,
    setSuggestionCategory,

    suggestionMessage,
    setSuggestionMessage,

    sendingSuggestion,

    senderName,
    setSenderName,

    senderEmail,
    setSenderEmail,

    division,
    setDivision,

    office,
    setOffice,

    submitSuggestion,
  } = props;

  return (
  <>

{showSuggestion && (

  <div
    className="
      fixed
      inset-0
      z-[999]

      bg-black/70

      flex
      items-center
      justify-center

      p-4
    "
  >

    <div
      className={`
        w-full
        max-w-xl
        rounded-3xl
        p-8
        relative
        max-h-[90vh]
        overflow-y-auto

        ${
          theme === "dark"
            ? `
              bg-[#071d33]
              text-white
              border border-cyan-300/20
            `
            : `
              bg-white
              text-slate-900
              border border-slate-200
            `
        }
      `}
    >

      <button
        onClick={() =>
          setShowSuggestion(false)
        }
        className="
  absolute
  top-4
  right-5

  text-3xl

  z-50
"
      >
        ×
      </button>

      <h2
        className="
          text-3xl
          font-bold
          mb-6
        "
      >
        Suggestion Box
      </h2>

      {/* NAME */}

<div className="mb-4">

  <label
    className="
      block
      mb-2
      text-sm
      opacity-70
    "
  >
    Name *
  </label>

  <input
    value={senderName}
    onChange={(e) =>
      setSenderName(
        e.target.value
      )
    }
    placeholder="Your name"
    className={`
      w-full

      px-4
      py-3

      rounded-xl

      border

      ${
        theme === "dark"
          ? `
              bg-[#0d2742]
              border-cyan-300/20
              text-white
            `
          : `
              bg-white
              border-slate-300
              text-slate-900
            `
      }
    `}
  />

</div>

{/* EMAIL */}

<div className="mb-4">

  <label
    className="
      block
      mb-2
      text-sm
      opacity-70
    "
  >
    Email *
  </label>

  <input
    type="email"
    value={senderEmail}
    onChange={(e) =>
      setSenderEmail(
        e.target.value
      )
    }
    placeholder="your@email.com"
    className={`
      w-full

      px-4
      py-3

      rounded-xl

      border

      ${
        theme === "dark"
          ? `
              bg-[#0d2742]
              border-cyan-300/20
              text-white
            `
          : `
              bg-white
              border-slate-300
              text-slate-900
            `
      }
    `}
  />

</div>

{/* DIVISION */}

<div className="mb-4">

  <label
    className="
      block
      mb-2
      text-sm
      opacity-70
    "
  >
    Division *
  </label>

  <input
    value={division}
    onChange={(e) =>
      setDivision(
        e.target.value
      )
    }
    placeholder="Procurement"
    className={`
      w-full

      px-4
      py-3

      rounded-xl

      border

      ${
        theme === "dark"
          ? `
              bg-[#0d2742]
              border-cyan-300/20
              text-white
            `
          : `
              bg-white
              border-slate-300
              text-slate-900
            `
      }
    `}
  />

</div>

{/* OFFICE */}

<div className="mb-4">

  <label
    className="
      block
      mb-2
      text-sm
      opacity-70
    "
  >
    Office *
  </label>

  <input
    value={office}
    onChange={(e) =>
      setOffice(
        e.target.value
      )
    }
    placeholder="Jakarta"
    className={`
      w-full

      px-4
      py-3

      rounded-xl

      border

      ${
        theme === "dark"
          ? `
              bg-[#0d2742]
              border-cyan-300/20
              text-white
            `
          : `
              bg-white
              border-slate-300
              text-slate-900
            `
      }
    `}
  />

</div>

      {/* CATEGORY */}

      <div className="mb-4">

        <label
          className="
            block
            mb-2
            text-sm
            opacity-70
          "
        >
          Category
        </label>

        <select
          value={suggestionCategory}
          onChange={(e) =>
            setSuggestionCategory(
              e.target.value
            )
          }
          className={`
            w-full

            px-4
            py-3

            rounded-xl

            border

            ${
              theme === "dark"
                ? `
                    bg-[#0d2742]
                    border-cyan-300/20
                    text-white
                  `
                : `
                    bg-white
                    border-slate-300
                    text-slate-900
                  `
            }
          `}
        >
          <option value="BUG">
                  Bug Report
                </option>

                <option value="FEATURE_REQUEST">
                  Feature Request
                </option>

                <option value="CATALOG_DATA">
                  Catalog Data Issue
                </option>

                <option value="UI_SUGGESTION">
                  UI/UX Suggestion
                </option>

                <option value="OTHER">
                  Other
                </option>


        </select>

      </div>

      {/* MESSAGE */}

      <div>

        <label
          className="
            block
            mb-2
            text-sm
            opacity-70
          "
        >
          Message
        </label>

        <textarea
          rows={6}
          value={suggestionMessage}
          onChange={(e) =>
            setSuggestionMessage(
              e.target.value
            )
          }
          placeholder="Describe your suggestion..."
          className={`
            w-full

            px-4
            py-3

            rounded-xl

            border

            resize-none

            ${
              theme === "dark"
                ? `
                    bg-[#0d2742]
                    border-cyan-300/20
                    text-white
                  `
                : `
                    bg-white
                    border-slate-300
                    text-slate-900
                  `
            }
          `}
        />
      </div>

      <button
        onClick={
          submitSuggestion
        }
        disabled={
          sendingSuggestion
        }
        className="
          mt-6

          w-full

          py-3

          rounded-xl

          bg-cyan-500

          text-white

          font-semibold

          hover:bg-cyan-600

          transition

          disabled:opacity-50
        "
      >
        {sendingSuggestion
          ? "Submitting..."
          : "Submit Suggestion"}
      </button>

    </div>

  </div>

)}
</>
);

}