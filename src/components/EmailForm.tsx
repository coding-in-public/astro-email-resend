import { render } from "@react-email/render";
import SampleEmail from "../emails/SampleEmail";
import { useState } from "react";

const dbData = [
  {
    email: "chris@learnastro.dev",
    name: "Chris Pennington",
    sent: false,
  },
  {
    email: "chris@learnastro.dev",
    name: "Chris Alternate",
    sent: false,
  },
  {
    email: "chris@learnastro.dev",
    name: "Chris Tertiary",
    sent: false,
  },
];

const EmailForm = () => {
  const [data, setData] = useState(dbData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    data.forEach(async (d) => {
      const finalHtml = render(<SampleEmail userFirstname={d.name} />, {
        pretty: true,
      });

      const finalText = render(<SampleEmail userFirstname={d.name} />, {
        plainText: true,
      });

      try {
        const res = await fetch("/api/sendEmail.json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "chris@learnastro.dev",
            to: d.email,
            subject: `Hi, ${d.name}`,
            html: finalHtml,
            text: finalText,
          }),
        });
        const data = await res.json();
        if (data) {
          setData((prev) => {
            return [
              ...prev.map((p) => {
                if (p.name === d.name) {
                  return { ...p, sent: true };
                }
                return p;
              }),
            ];
          });
        }
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <div className="grid gap-4">
      {data && (
        <table className="table-auto max-w-md text-center">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Sent</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.email}>
                <td>{row.email}</td>
                <td>{row.name}</td>
                <td>{row.sent ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <form onSubmit={handleSubmit}>
        <input type="submit" value="Send Email" />
      </form>
    </div>
  );
};
export default EmailForm;
