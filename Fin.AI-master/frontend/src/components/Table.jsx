<tr class="backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/20">
  <th class="px-6 py-4 text-left text-sm font-semibold text-purple-900 dark:text-white">Company</th>
  <th class="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">CMP (₹)</th>
  <th class="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">P/E</th>
  <th class="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Market Cap (Cr)</th>
  <th class="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Div Yield %</th>
  <th class="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Net Profit Qtr (Cr)</th>
  <th class="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Qtr Profit Var %</th>
  <th class="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Sales Qtr (Cr)</th>
  <th class="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">Qtr Sales Var %</th>
  <th class="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">ROCE %</th>
  <th class="px-6 py-4 text-right text-sm font-semibold text-purple-900 dark:text-white">PAT Qtr (Cr)</th>
</tr>

{error ? (
  <tr class="text-center">
    <td colSpan="11" class="px-6 py-4 text-sm text-red-500">
      Unable to load fundamental data. Please check your subscription level or try again later.
    </td>
  </tr>
) : (
  // Original table content
)} 