import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Download, PieChart, TrendingUp } from "lucide-react";

export default function PortfolioPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container px-4 py-6 md:px-6 md:py-12">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
            <p className="text-muted-foreground">
              Track your gas futures contracts and analyze your savings.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.7 SUI</div>
                <p className="text-xs text-muted-foreground">
                  Across all active contracts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3 SUI</div>
                <p className="text-xs text-muted-foreground">
                  Based on current gas prices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Discount</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5%</div>
                <p className="text-xs text-muted-foreground">
                  Compared to market prices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remaining Credits</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72,500</div>
                <p className="text-xs text-muted-foreground">
                  Across all active contracts
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList>
              <TabsTrigger value="summary">Portfolio Summary</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Contracts</CardTitle>
                  <CardDescription>Your current gas futures contracts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contract</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Locked Price</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total Credits</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Used</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Remaining</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Expiry</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Savings</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">30-Day Gas Future</td>
                          <td className="p-4 align-middle">0.00022 SUI</td>
                          <td className="p-4 align-middle">10,000</td>
                          <td className="p-4 align-middle">7,500</td>
                          <td className="p-4 align-middle">2,500</td>
                          <td className="p-4 align-middle">June 15, 2024</td>
                          <td className="p-4 align-middle text-green-500">+0.75 SUI</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">60-Day Gas Future</td>
                          <td className="p-4 align-middle">0.00023 SUI</td>
                          <td className="p-4 align-middle">25,000</td>
                          <td className="p-4 align-middle">5,000</td>
                          <td className="p-4 align-middle">20,000</td>
                          <td className="p-4 align-middle">July 15, 2024</td>
                          <td className="p-4 align-middle text-green-500">+0.50 SUI</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">90-Day Gas Future</td>
                          <td className="p-4 align-middle">0.00024 SUI</td>
                          <td className="p-4 align-middle">50,000</td>
                          <td className="p-4 align-middle">0</td>
                          <td className="p-4 align-middle">50,000</td>
                          <td className="p-4 align-middle">August 15, 2024</td>
                          <td className="p-4 align-middle text-green-500">+1.05 SUI (potential)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" /> Export Data
                  </Button>
                  <Link href="/trade">
                    <Button size="sm" className="gap-1">
                      Purchase New Contract <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Recent transactions using gas credits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Transaction</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contract</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Credits Used</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Market Price</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contract Price</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Savings</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">May 18, 2024</td>
                          <td className="p-4 align-middle">0x7a23...9f12</td>
                          <td className="p-4 align-middle">30-Day Gas Future</td>
                          <td className="p-4 align-middle">500</td>
                          <td className="p-4 align-middle">0.00025 SUI</td>
                          <td className="p-4 align-middle">0.00022 SUI</td>
                          <td className="p-4 align-middle text-green-500">+0.015 SUI</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">May 17, 2024</td>
                          <td className="p-4 align-middle">0x3b45...7d21</td>
                          <td className="p-4 align-middle">30-Day Gas Future</td>
                          <td className="p-4 align-middle">1,000</td>
                          <td className="p-4 align-middle">0.00026 SUI</td>
                          <td className="p-4 align-middle">0.00022 SUI</td>
                          <td className="p-4 align-middle text-green-500">+0.040 SUI</td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">May 16, 2024</td>
                          <td className="p-4 align-middle">0x9c67...2e34</td>
                          <td className="p-4 align-middle">60-Day Gas Future</td>
                          <td className="p-4 align-middle">2,000</td>
                          <td className="p-4 align-middle">0.00025 SUI</td>
                          <td className="p-4 align-middle">0.00023 SUI</td>
                          <td className="p-4 align-middle text-green-500">+0.040 SUI</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" /> Export History
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Savings Analysis</CardTitle>
                  <CardDescription>Visualize your gas cost savings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full rounded-md border border-dashed flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Savings chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
} 