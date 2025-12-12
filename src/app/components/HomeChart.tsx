"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function HomeChart() {
  return (
    <div className="grid gap-6 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      <Card className="w-full border border-gray-400">
        <CardHeader>
          <CardTitle className="text-primary-md">Employee Headcount</CardTitle>
          <CardDescription>Total employees over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              headcount: {
                label: "Headcount",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { month: "Jan", headcount: 120 },
                  { month: "Feb", headcount: 125 },
                  { month: "Mar", headcount: 130 },
                  { month: "Apr", headcount: 135 },
                  { month: "May", headcount: 140 },
                  { month: "Jun", headcount: 145 },
                ]}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="headcount" stroke="var(--color-headcount)" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full border border-gray-400">
        <CardHeader>
          <CardTitle className="text-primary-md">Department Distribution</CardTitle>
          <CardDescription>Employee distribution across departments</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              employees: {
                label: "Employees",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { department: "HR", employees: 15 },
                  { department: "Engineering", employees: 50 },
                  { department: "Sales", employees: 30 },
                  { department: "Marketing", employees: 20 },
                  { department: "Finance", employees: 10 },
                ]}
              >
                <XAxis dataKey="department" />
                <YAxis />
                <Bar dataKey="employees" fill="var(--color-employees)" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full border border-gray-400">
        <CardHeader>
          <CardTitle className="text-primary-md">Employee Turnover Rate</CardTitle>
          <CardDescription>Monthly turnover rate for the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              turnover: {
                label: "Turnover Rate",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { month: "Jan", turnover: 2.5 },
                  { month: "Feb", turnover: 2.2 },
                  { month: "Mar", turnover: 2.8 },
                  { month: "Apr", turnover: 2.1 },
                  { month: "May", turnover: 2.4 },
                  { month: "Jun", turnover: 2.3 },
                ]}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Area type="monotone" dataKey="turnover" stroke="var(--color-turnover)" fill="var(--color-turnover)" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full border border-gray-400">
        <CardHeader>
          <CardTitle className="text-primary-md">Training Completion</CardTitle>
          <CardDescription>Percentage of employees who completed required training</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              completion: {
                label: "Completion",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="60%"
                outerRadius="80%"
                data={[{ name: 'Completion Rate', value: 85 }]}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={15}
                  fill="var(--color-completion)"
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl font-bold"
                >
                  85%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full border border-gray-400">
        <CardHeader>
          <CardTitle className="text-primary-md">Salary Distribution</CardTitle>
          <CardDescription>Distribution of salaries across the company</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              employees: {
                label: "Employees",
                color: "hsl(var(--chart-5))",
              },
            }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { range: "30k-50k", employees: 20 },
                  { range: "50k-70k", employees: 35 },
                  { range: "70k-90k", employees: 25 },
                  { range: "90k-110k", employees: 15 },
                  { range: "110k+", employees: 5 },
                ]}
              >
                <XAxis dataKey="range" />
                <YAxis />
                <Bar dataKey="employees" fill="var(--color-employees)" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full border border-gray-400">
        <CardHeader>
          <CardTitle className="text-primary-md">Performance Ratings</CardTitle>
          <CardDescription>Distribution of employee performance ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              employees: {
                label: "Employees",
                color: "hsl(var(--chart-6))",
              },
            }}
            className="w-full h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="30%"
                outerRadius="70%"
                data={[
                  { name: 'Exceptional', value: 20 },
                  { name: 'Exceeds Expectations', value: 35 },
                  { name: 'Meets Expectations', value: 30 },
                  { name: 'Needs Improvement', value: 15 },
                ]}
                startAngle={0}
                endAngle={360}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={15}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

