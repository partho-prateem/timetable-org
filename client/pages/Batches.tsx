import { AppLayout, PageTitle } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const rows = [
  { id: "2025-CSE-A", name: "CSE Batch A (2025)" },
  { id: "2025-CSE-B", name: "CSE Batch B (2025)" },
  { id: "2025-ECE-A", name: "ECE Batch A (2025)" },
];

export default function Batches() {
  return (
    <AppLayout>
      <PageTitle title="Batches" description="Student batches and cohorts" />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Code</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
