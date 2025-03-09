import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, Clock, Shield, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container px-4 py-6 md:px-6 md:py-12">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">About Gas Futures</h1>
            <p className="text-muted-foreground">
              Understanding how gas futures work on the Sui blockchain.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">What are Gas Futures?</h2>
            <p className="text-muted-foreground">
              Gas Futures are financial instruments that allow users to hedge against gas price volatility on the Sui blockchain.
              By purchasing gas credits at a predefined price for future use, businesses and users can secure predictable
              transaction costs, similar to commodity futures markets like oil.
            </p>
            <p className="text-muted-foreground">
              This mechanism provides stability and cost-efficiency for using the Sui blockchain, especially for businesses
              that require predictable operational costs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>The mechanics behind gas futures contracts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">1. Purchase Gas Credits</h3>
                  <p className="text-sm text-muted-foreground">
                    Users purchase gas credits at a fixed price, locking in the cost for future transactions.
                    These credits are stored in smart contracts and can be redeemed during the contract period.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">2. Contract Terms</h3>
                  <p className="text-sm text-muted-foreground">
                    Each contract has specific terms, including the locked gas price, number of gas credits,
                    and expiration date. Contracts are available in various durations (30, 60, or 90 days).
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">3. Automatic Redemption</h3>
                  <p className="text-sm text-muted-foreground">
                    When executing transactions, the system automatically applies gas credits from active contracts,
                    using the locked price instead of the current market price.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">4. Expiration</h3>
                  <p className="text-sm text-muted-foreground">
                    Unused gas credits expire after the contract end date. Users should plan their purchases
                    based on expected transaction volume.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
                <CardDescription>Advantages of using gas futures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">Predictable Costs</h3>
                    <p className="text-sm text-muted-foreground">
                      Protect against gas price volatility by locking in prices, making budgeting and financial planning more reliable.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">Cost Savings</h3>
                    <p className="text-sm text-muted-foreground">
                      Potentially save on transaction costs if market gas prices increase during the contract period.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">Flexible Durations</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose from various contract durations to match your specific needs and time horizons.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">Seamless Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Gas credits are automatically applied to transactions, requiring no additional steps during execution.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Technical Implementation</h2>
            <p className="text-muted-foreground">
              Our Gas Futures platform is built on the Sui blockchain using Move smart contracts. The system includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Smart contracts for managing gas credit issuance, tracking, and redemption</li>
              <li>Integration with DeepBook for trading gas futures contracts</li>
              <li>Risk management framework to ensure financial sustainability</li>
              <li>Pricing model based on historical gas price data and market demand</li>
              <li>User-friendly interfaces for purchasing, monitoring, and redeeming gas credits</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Use Cases</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>DeFi Protocols</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    DeFi protocols can use gas futures to ensure predictable operational costs for automated transactions,
                    improving financial planning and user experience.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Businesses operating on Sui can budget their blockchain transaction costs in advance,
                    reducing financial uncertainty and improving operational efficiency.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>High-Volume Traders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Traders and market makers can lock in gas prices to maintain consistent profit margins
                    regardless of gas price fluctuations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-center">
            <Link href="/trade">
              <Button size="lg" className="gap-1">
                Start Trading <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 