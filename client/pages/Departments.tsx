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
import { Button } from "@/components/ui/button";

const rows = [
  { id: "cse", name: "Computer Science" },
  { id: "ece", name: "Electronics" },
  { id: "mech", name: "Mechanical" },
];

export default function Departments() {
  return (
    <AppLayout>
      <PageTitle
        title="Departments"
        description="Organize your institute's departments"
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-40" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id.toUpperCase()}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="secondary">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
