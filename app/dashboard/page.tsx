import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, BarChart3, Clock, DollarSign, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container px-4 py-6 md:px-6 md:py-12">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your gas futures contracts and monitor market conditions.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Gas Credits</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,231</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  +2 new this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Gas Price</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.00025 SUI</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5%</div>
                <p className="text-xs text-muted-foreground">
                  Average savings on gas costs
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active Contracts</TabsTrigger>
              <TabsTrigger value="expired">Expired Contracts</TabsTrigger>
              <TabsTrigger value="market">Market Data</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>30-Day Gas Future</CardTitle>
                    <CardDescription>Expires on June 15, 2024</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Locked Price:</span>
                        <span className="font-medium">0.00022 SUI</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Credits:</span>
                        <span className="font-medium">10,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Used Credits:</span>
                        <span className="font-medium">7,500</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Remaining Credits:</span>
                        <span className="font-medium">2,500</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[75%]"></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>60-Day Gas Future</CardTitle>
                    <CardDescription>Expires on July 15, 2024</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Locked Price:</span>
                        <span className="font-medium">0.00023 SUI</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Credits:</span>
                        <span className="font-medium">25,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Used Credits:</span>
                        <span className="font-medium">5,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Remaining Credits:</span>
                        <span className="font-medium">20,000</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[20%]"></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>90-Day Gas Future</CardTitle>
                    <CardDescription>Expires on August 15, 2024</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Locked Price:</span>
                        <span className="font-medium">0.00024 SUI</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Credits:</span>
                        <span className="font-medium">50,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Used Credits:</span>
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Remaining Credits:</span>
                        <span className="font-medium">50,000</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[0%]"></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="expired" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>15-Day Gas Future</CardTitle>
                    <CardDescription>Expired on May 15, 2024</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Locked Price:</span>
                        <span className="font-medium">0.00020 SUI</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Credits:</span>
                        <span className="font-medium">5,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Used Credits:</span>
                        <span className="font-medium">5,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Savings:</span>
                        <span className="font-medium text-green-500">+15%</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View History
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="market" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gas Price Trends</CardTitle>
                  <CardDescription>Historical and projected gas prices on Sui</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full rounded-md border border-dashed flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Gas price chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Link href="/trade">
              <Button className="gap-1">
                Purchase New Contract <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 