require 'graph-rank'

text = "From what we now know of Stalin, he seemed to believe in the basics of Marxist-Leninism. As a communist, didn't he fear that killing his own military's leadership would seriously endanger the world's only socialist experiment against capitalist rivals? 1936 moreover was several years after the rise of Hitler. Didn't Stalin realize an escalation of political tensions was going to lead to war soon? There is every indication that Stalin was a ruthless, cruel man. He also displayed moments of great opportunism and caution during his rise to political power throughout the 1930s and his later conduct of the war after 1942. What motivation beyond paranoia led to the purges, which seems like such a self-evident detrimental policy?"

text2 = "There is every indication that Stalin was pretty aware of the upcoming conflict. In 1929 Stalin started the Industrialization in order to prepare to war. In the interwar period the USSR had enough enemies even without Hitler, the most outstanding were Poland and Japan."

tr = GraphRank::Keywords.new

tr.run(text)

p tr.calculate_ranking
