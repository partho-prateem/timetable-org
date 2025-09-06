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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const rows = [
  { id: "f01", name: "Dr. Alice Chen" },
  { id: "f02", name: "Prof. Brian Mills" },
  { id: "f03", name: "Dr. Carmen Díaz" },
];

export default function Faculties() {
  return (
    <AppLayout>
      <PageTitle title="Faculties" description="Manage faculty members" />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback>
                        {r.name
                          .split(" ")
                          .map((s) => s[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {r.name}
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
