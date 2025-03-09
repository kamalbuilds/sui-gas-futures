import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Info } from "lucide-react";

export default function TradePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container px-4 py-6 md:px-6 md:py-12">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Purchase Gas Futures</h1>
            <p className="text-muted-foreground">
              Lock in gas prices now to protect against future volatility.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Information</CardTitle>
                  <CardDescription>Current gas prices and market conditions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current Reference Gas Price:</span>
                      <span className="font-medium">0.00025 SUI</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current Storage Gas Price:</span>
                      <span className="font-medium">0.00010 SUI</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">7-Day Average:</span>
                      <span className="font-medium">0.00023 SUI</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">30-Day Average:</span>
                      <span className="font-medium">0.00022 SUI</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">30-Day Volatility:</span>
                      <span className="font-medium">±15%</span>
                    </div>
                  </div>
                  <div className="h-[200px] w-full rounded-md border border-dashed flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Gas price chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Contract Types</CardTitle>
                  <CardDescription>Choose a contract duration</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="30day" className="space-y-4">
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="30day">30 Days</TabsTrigger>
                      <TabsTrigger value="60day">60 Days</TabsTrigger>
                      <TabsTrigger value="90day">90 Days</TabsTrigger>
                    </TabsList>
                    <TabsContent value="30day" className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Contract Price:</span>
                          <span className="font-medium">0.00022 SUI</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Premium:</span>
                          <span className="font-medium text-green-500">-12% vs current price</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Expiry Date:</span>
                          <span className="font-medium">June 15, 2024</span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="60day" className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Contract Price:</span>
                          <span className="font-medium">0.00023 SUI</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Premium:</span>
                          <span className="font-medium text-green-500">-8% vs current price</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Expiry Date:</span>
                          <span className="font-medium">July 15, 2024</span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="90day" className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Contract Price:</span>
                          <span className="font-medium">0.00024 SUI</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Premium:</span>
                          <span className="font-medium text-green-500">-4% vs current price</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Expiry Date:</span>
                          <span className="font-medium">August 15, 2024</span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Contract</CardTitle>
                  <CardDescription>Configure and purchase your gas futures contract</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contract-type">Contract Duration</Label>
                    <Select defaultValue="30day">
                      <SelectTrigger id="contract-type">
                        <SelectValue placeholder="Select contract duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30day">30 Days (0.00022 SUI)</SelectItem>
                        <SelectItem value="60day">60 Days (0.00023 SUI)</SelectItem>
                        <SelectItem value="90day">90 Days (0.00024 SUI)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="gas-credits">Gas Credits to Purchase</Label>
                      <span className="text-sm text-muted-foreground">10,000 credits</span>
                    </div>
                    <Slider defaultValue={[10000]} min={1000} max={100000} step={1000} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1,000</span>
                      <span>50,000</span>
                      <span>100,000</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="total-cost">Total Cost</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="total-cost" value="2.2 SUI" readOnly />
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      10,000 credits × 0.00022 SUI = 2.2 SUI
                    </p>
                  </div>

                  <div className="rounded-md bg-muted p-3">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Contract Terms</p>
                        <p className="text-xs text-muted-foreground">
                          By purchasing this contract, you are securing gas credits at the specified price until the expiry date.
                          Credits will be automatically applied to your transactions until they are depleted or the contract expires.
                          Unused credits will expire after the contract end date.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button className="w-full">Purchase Contract</Button>
                  <p className="text-xs text-center text-muted-foreground">
                    You will be prompted to sign this transaction with your wallet
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 