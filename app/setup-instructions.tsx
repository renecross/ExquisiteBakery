import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function SetupInstructions() {
  return (
    <Card className="max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Setup Instructions</CardTitle>
        <CardDescription>Configure your environment to connect to Supabase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Missing Supabase Configuration</AlertTitle>
          <AlertDescription>
            The application is currently running in demo mode with mock data because Supabase environment variables are
            not configured.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Follow these steps to connect to Supabase:</h3>

          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Create a Supabase project at{" "}
              <a
                href="https://supabase.com"
                className="text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://supabase.com
              </a>
            </li>
            <li>Go to your project settings: Project Settings &gt; API</li>
            <li>Copy the "Project URL" and "anon public" key</li>
            <li>
              Create a <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file in your project root with
              the following variables:
            </li>
          </ol>

          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>
              NEXT_PUBLIC_SUPABASE_URL=your_supabase_url{"\n"}
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
            </code>
          </pre>

          <p>After adding these environment variables, restart your development server to apply the changes.</p>

          <h3 className="text-lg font-medium mt-6">Database Setup</h3>
          <p>
            Run the SQL scripts in the <code className="bg-muted px-1 py-0.5 rounded">scripts</code> folder to set up
            your database schema and seed data:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Run <code className="bg-muted px-1 py-0.5 rounded">setup-database.sql</code> to create the tables
            </li>
            <li>
              Run <code className="bg-muted px-1 py-0.5 rounded">seed-data.sql</code> to populate the database with
              sample data
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
